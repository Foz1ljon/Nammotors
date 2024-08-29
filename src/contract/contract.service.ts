import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateContractDto } from './dto/create-contract.dto';
import { UpdateContractDto } from './dto/update-contract.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Contract } from './schemas/contract.schemas';
import { Model } from 'mongoose';
import { Client } from '../clients/schemas/client.schemas';
import { Admin } from '../admins/schemas/admin.schema';
import { Product } from '../products/schemas/product.schemas';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { checkId } from '../common/utils/check-mongodbId';

@Injectable()
export class ContractService {
  constructor(
    @InjectModel(Contract.name) private contModel: Model<Contract>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Product.name) private productModel: Model<Product>,
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}

  // Tokenni dekodlash funksiyasi
  private async decodeToken(token: string): Promise<string> {
    const [bearer, tkn] = token.split(' ');

    // Token formatini tekshirish
    if (bearer !== 'Bearer' || !tkn) {
      throw new UnauthorizedException('Noto‘g‘ri token formati');
    }

    try {
      // Tokenni dekodlash
      const decoded = await this.jwtService.verify(tkn, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
      });
      return decoded.id;
    } catch {
      throw new UnauthorizedException('Noto‘g‘ri token');
    }
  }

  // Berilgan model va ID orqali entitini topish
  private async findEntityById<T>(
    model: Model<T>,
    id: string,
    entityName: string,
  ): Promise<T> {
    checkId(id); // ID ni tekshirish
    const entity = await model.findById(id);
    if (!entity) {
      throw new NotFoundException(`${entityName} topilmadi`);
    }
    return entity;
  }

  // Telefon raqami bo‘yicha mijozni topish funksiyasi
  private async findClientByPhoneNumber(phoneNumber: string): Promise<Client> {
    const client = await this.clientModel.findOne({
      phone_number: phoneNumber,
    });
    if (!client) {
      throw new NotFoundException('Mijoz topilmadi');
    }
    return client;
  }

  // Mahsulot IDlarini tekshirish va summani hisoblash funksiyasi
  private async findAndValidateProducts(productIds: string[]): Promise<number> {
    let totalSum = 0;

    for (const itemId of productIds) {
      const product = await this.findEntityById(
        this.productModel,
        itemId,
        'Mahsulot',
      );
      if (+product.count === 0) {
        throw new BadRequestException({
          message: 'Kechirasiz, bu mahsulot tugagan',
          product,
        });
      }
      product.count = String(+product.count - 1); // Mahsulot sonidan ayirish
      totalSum += +product.price; // Umumiy summani hisoblash
      await product.save(); // Mahsulotni saqlash
    }

    return totalSum;
  }

  // To‘lov turini tekshirish funksiyasi
  private validatePaymentType(paytype: string): void {
    const validTypes = ['cash', 'card', 'credit'];
    if (!validTypes.includes(paytype.toLowerCase())) {
      throw new BadRequestException('Noto‘g‘ri to‘lov turi');
    }
  }

  // Chegirma hisoblash funksiyasi
  private applyDiscount(summa: number, discount: number): number {
    if (discount < 0) {
      throw new BadRequestException('Noto‘g‘ri chegirma qiymati');
    }
    return discount > 0 ? summa - (summa / 100) * discount : summa; // Chegirma qo‘llash
  }

  // Shartnoma yaratish funksiyasi
  async create(createContractDto: CreateContractDto, token: string) {
    const { product, discount, paytype } = createContractDto;

    // Mahsulotlar bo‘yicha umumiy summani hisoblash
    const totalSum = await this.findAndValidateProducts(product);
    const client = await this.findClientByPhoneNumber(createContractDto.client);
    const adminId = await this.decodeToken(token); // Tokenni dekodlash
    await this.findEntityById(this.adminModel, adminId, 'Admin'); // Adminni topish

    this.validatePaymentType(paytype); // To‘lov turini tekshirish
    const finalSum = this.applyDiscount(totalSum, discount); // Chegirma qo‘llash

    // Yangi shartnoma yaratish
    const contract = await this.contModel.create({
      product,
      vendor: adminId,
      client,
      discount,
      paytype,
      price: finalSum,
    });

    await contract.populate('product'); // Mahsulotni populatsiya qilish
    return contract; // Yangi shartnomani qaytarish
  }

  // Barcha shartnomalarni olish funksiyasi
  async findAll() {
    return this.contModel.find().populate(['client', 'vendor', 'product']);
  }

  // Bitta shartnomani ID bo‘yicha topish funksiyasi
  async findOne(id: string) {
    const contract = await this.findEntityById(this.contModel, id, 'Shartnoma');

    return contract.populate(['client', 'vendor', 'product']);
  }

  // Shartnomani yangilash funksiyasi
  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    token: string,
  ) {
    const contract = await this.findEntityById(this.contModel, id, 'Shartnoma'); // Shartnomani topish

    const adminId = await this.decodeToken(token); // Tokenni dekodlash va adminni tekshirish
    await this.findEntityById(this.adminModel, adminId, 'Admin');

    // Mijozni telefon raqami orqali topish yoki mavjud mijozni saqlash
    const clientId = updateContractDto.client
      ? await this.findClientByPhoneNumber(updateContractDto.client)
      : contract.client;

    // Mahsulotlar yangilansa, umumiy summani qayta hisoblash
    const totalSum = updateContractDto.product
      ? await this.findAndValidateProducts(updateContractDto.product)
      : contract.price; // Mavjud shartnoma summasini saqlash

    // To‘lov turini tekshirish
    if (updateContractDto.paytype) {
      this.validatePaymentType(updateContractDto.paytype);
    } else {
      updateContractDto.paytype = contract.paytype; // Mavjud to‘lov turini saqlash
    }

    // Chegirma hisoblash
    const finalSum = this.applyDiscount(
      totalSum,
      updateContractDto.discount || 0,
    );
    updateContractDto.price = finalSum.toString(); // Yangilangan summani saqlash

    // Yangilangan shartnomani yaratish
    const updatedContract = Object.assign(contract, {
      ...updateContractDto,
      client: clientId,
    });

    await updatedContract.save(); // Yangilangan shartnomani saqlash
    return updatedContract.populate(['client', 'vendor', 'product']); // Mahsulotni populatsiya qilish
  }

  // Shartnomani o‘chirish funksiyasi
  async remove(id: string) {
    await this.findEntityById(this.contModel, id, 'Shartnoma'); // Shartnomani topish
    await this.contModel.deleteOne({ _id: id }).exec(); // Shartnomani o‘chirish
    return { message: 'Shartnoma muvaffaqiyatli o‘chirildi' }; // Muvaffaqiyatli xabar
  }
}
