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

  async decodeToken(token: string) {
    console.log(token);

    const [bearer, tkn] = token.split(' ');

    if (bearer !== 'Bearer' || !tkn) {
      throw new UnauthorizedException('Noto‘g‘ri token formati');
    }

    try {
      const decoded = await this.jwtService.verify(tkn, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
      });
      return decoded.id;
    } catch (error) {
      console.error('Noto‘g‘ri token', error.stack);
      throw new UnauthorizedException('Noto‘g‘ri token');
    }
  }

  async create(createContractDto: CreateContractDto, token: string) {
    const type = ['cash', 'card', 'credit'];
    const { product, client, discount, paytype } = createContractDto;

    // Mahsulot IDlarini tekshirish va jamlash
    let summa = 0;
    for (const item of product) {
      checkId(item);
      const findProd = await this.productModel.findById(item);
      if (!findProd) throw new NotFoundException('Mahsulot topilmadi');
      // Mahsulot bor yoqligni tekshirish
      if (+findProd.count == 0)
        throw new BadRequestException({
          message: 'Kechirasiz bu mahsulot tugagan',
          product: findProd,
        });
      // Mahsulot sonidan ayirish
      findProd.count = String(+findProd.count - 1);
      summa += +findProd.price;
      await findProd.save();
    }

    // Mijoz IDsi tekshirish
    checkId(client);
    const findClient = await this.clientModel.findById(client);
    if (!findClient) throw new NotFoundException('Mijoz topilmadi');

    // Admin tokenini dekodlash
    const adminId = await this.decodeToken(token);
    checkId(adminId);
    const findAdmin = await this.adminModel.findById(adminId);
    if (!findAdmin) throw new NotFoundException('Admin topilmadi');

    // To'lov turini tekshirish
    const bool = type.includes(paytype.toLowerCase());
    if (!bool) throw new BadRequestException('Noto‘g‘ri to‘lov turi');

    // Chegirma hisoblash
    if (discount < 0)
      throw new BadRequestException('Noto‘g‘ri chegirma qiymati');

    if (discount > 0) {
      summa = summa - (summa / 100) * discount;
      console.log(summa);
    }

    // Shartnomani yaratish va saqlash
    const contract = new this.contModel({
      product,
      vendor: findAdmin,
      client: findClient,
      discount,
      paytype,
      price: summa,
    });
    await contract.save();

    return contract.populate('product');
  }

  async findAll() {
    return this.contModel.find().exec();
  }

  async findOne(id: string) {
    checkId(id);
    const contract = await this.contModel.findById(id);
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    return contract;
  }

  async update(
    id: string,
    updateContractDto: UpdateContractDto,
    token: string,
  ) {
    checkId(id);
    const contract = await this.contModel.findById(id);
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');

    const adminId = await this.decodeToken(token);
    checkId(adminId);
    const findAdmin = await this.adminModel.findById(adminId);
    if (!findAdmin) throw new NotFoundException('Admin topilmadi');

    Object.assign(contract, updateContractDto);
    await contract.save();
    return contract;
  }

  async remove(id: string) {
    checkId(id);
    const contract = await this.contModel.findById(id);
    if (!contract) throw new NotFoundException('Shartnoma topilmadi');
    await this.contModel.deleteOne({ _id: id }).exec();
    return { message: 'Shartnoma muvaffaqiyatli o‘chirildi' };
  }
}
