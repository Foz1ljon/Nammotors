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

    // Token formati to'g'ri ekanligini tekshirish
    if (bearer !== 'Bearer' || !tkn) {
      throw new UnauthorizedException('Noto‘g‘ri token formati');
    }

    try {
      // Tokenni dekodlash
      const decoded = await this.jwtService.verify(tkn, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
      });
      return decoded.id;
    } catch (error) {
      throw new UnauthorizedException('Noto‘g‘ri token');
    }
  }

  // Adminni ID bo‘yicha topish funksiyasi
  private async findAdminById(adminId: string): Promise<Admin> {
    checkId(adminId);
    const admin = await this.adminModel.findById(adminId);
    if (!admin) {
      throw new NotFoundException('Admin topilmadi');
    }
    return admin;
  }

  // Telefon raqam bo‘yicha mijozni topish funksiyasi
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
  private async findAndValidateProduct(productIds: string[]): Promise<number> {
    let totalSum = 0;

    for (const itemId of productIds) {
      checkId(itemId);
      const product = await this.productModel.findById(itemId);
      if (!product) throw new NotFoundException('Mahsulot topilmadi');
      if (+product.count === 0) {
        throw new BadRequestException({
          message: 'Kechirasiz, bu mahsulot tugagan',
          product,
        });
      }
      product.count = String(+product.count - 1); // Mahsulot sonidan ayirish
      totalSum += +product.price; // Umumiy summani hisoblash
      await product.save();
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
    if (discount > 0) {
      return summa - (summa / 100) * discount; // Chegirma qo‘llash
    }
    return summa;
  }

  // Shartnoma yaratish funksiyasi
  async create(createContractDto: CreateContractDto, token: string) {
    const { product, discount, paytype } = createContractDto;

    const totalSum = await this.findAndValidateProduct(product);

    const client = await this.findClientByPhoneNumber(createContractDto.client);

    const adminId = await this.decodeToken(token);
    const admin = await this.findAdminById(adminId);

    this.validatePaymentType(paytype);

    const finalSum = this.applyDiscount(totalSum, discount);

    const contract = new this.contModel({
      product,
      vendor: admin,
      client,
      discount,
      paytype,
      price: finalSum,
    });

    await contract.save();

    return contract.populate('product');
  }

  // Barcha shartnomalarni olish funksiyasi
  async findAll() {
    return this.contModel.find().populate(['client', 'vendor', 'product']);
  }

  // Bitta shartnomani ID bo‘yicha topish funksiyasi
  async findOne(id: string) {
    checkId(id);
    const contract = await this.contModel
      .findById(id)
      .populate(['client', 'vendor', 'product']);
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    return contract;
  }

  // Shartnomani yangilash funksiyasi
  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    token: string,
  ) {
    checkId(id);
    const contract = await this.contModel.findById(id);
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');

    const adminId = await this.decodeToken(token);
    await this.findAdminById(adminId);

    // Agar yangi mahsulotlar qo‘shilsa, summani qayta hisoblash
    if (updateContractDto.product) {
      const totalSum = await this.findAndValidateProduct(
        updateContractDto.product,
      );
      const price = this.applyDiscount(
        totalSum,
        updateContractDto.discount || 0,
      );
      updateContractDto.price = price.toString();
    }

    Object.assign(contract, updateContractDto);
    await contract.save();

    return contract.populate(['client', 'vendor', 'product']);
  }

  // Shartnomani o‘chirish funksiyasi
  async remove(id: string) {
    checkId(id);
    const contract = await this.contModel.findById(id);
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    await this.contModel.deleteOne({ _id: id }).exec();
    return { message: 'Shartnoma muvaffaqiyatli o‘chirildi' };
  }
}
