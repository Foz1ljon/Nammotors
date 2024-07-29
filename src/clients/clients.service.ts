import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schemas/client.schemas';
import { SearchClientDto } from './dto/search-client.dto';
import { checkId } from '../common/utils/check-mongodbId';
import { Admin } from '../admins/schemas/admin.schema';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

@Injectable()
export class ClientsService {
  private readonly logger = new Logger(ClientsService.name);

  constructor(
    @InjectModel(Client.name) private clientModel: Model<Client>,
    @InjectModel(Admin.name) private adminModel: Model<Admin>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async decodeToken(token: string) {
    const data = token.split(' ')[1];
    try {
      const decoded = await this.jwtService.verify(data, {
        secret: this.configService.get<string>('JWT_ACCESS_TOKEN'),
      });
      return decoded.id;
    } catch (error) {
      this.logger.error('Invalid token', error.stack);
      throw new UnauthorizedException('Invalid token');
    }
  }

  async create(createClientDto: CreateClientDto, token: string) {
    const id = await this.decodeToken(token);
    checkId(id);

    const findAdmin = await this.adminModel.findById(id).exec();
    if (!findAdmin) throw new NotFoundException('Admin not found');

    const data = await this.clientModel.create({
      admin: findAdmin._id,
      ...createClientDto,
    });

    findAdmin.clients.push(data);
    await findAdmin.save();

    return {
      message: 'Client created successfully!',
      data: data.populate('admin'),
    };
  }
  async search(searchClientDto: SearchClientDto): Promise<Client[]> {
    const { query } = searchClientDto;
    const queries: any = {};

    if (query) {
      queries.$or = [
        { fname: { $regex: query, $options: 'i' } },
        { phone_number: { $regex: query, $options: 'i' } },
        { firma: { $regex: query, $options: 'i' } },
      ];
    }

    return this.clientModel.find(queries).populate('admin').exec();
  }

  async findById(id: string) {
    checkId(id);
    const client = await this.clientModel.findById(id).populate('admin');
    if (!client) throw new NotFoundException('Mijoz topilmadi');
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto, token: string) {
    const adminId = await this.decodeToken(token);
    checkId(id);
    checkId(adminId);

    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new NotFoundException('Admin not found');

    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Client not found');

    // if (!admin.clients.includes(client.id)) {
    //   throw new UnauthorizedException('Sizda ruxsat yo`q');
    // } admin function

    const data = await this.clientModel.findByIdAndUpdate(id, updateClientDto, {
      new: true,
    });
    return data;
  }

  async remove(id: string, token: string) {
    const adminId = await this.decodeToken(token);
    checkId(id);
    checkId(adminId);

    const admin = await this.adminModel.findById(adminId);
    if (!admin) throw new NotFoundException('Admin topilmadi');

    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Mijoz topilmadi');

    if (!admin.clients.includes(client.id)) {
      throw new UnauthorizedException('Sizda ruxsat yo`q');
    }

    const clients = admin.clients.filter(
      (clientId) => clientId.toString() !== client.id.toString(),
    );

    admin.clients = clients;
    await admin.save();
    await this.clientModel.findByIdAndDelete(id);

    return { message: 'Mijoz o`chirildi!' };
  }
}
