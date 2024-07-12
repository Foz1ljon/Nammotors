import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Client } from './schemas/client.schemas';
import { SearchClientDto } from './dto/search-client.dto';
import { checkId } from '../common/utils/check-mongodbId';

@Injectable()
export class ClientsService {
  constructor(@InjectModel(Client.name) private clientModel: Model<Client>) {}

  create(createClientDto: CreateClientDto) {
    return this.clientModel.create(createClientDto);
  }

  async search(searchClientDto: SearchClientDto): Promise<Client[]> {
    const { fname, phone_number, firma } = searchClientDto;

    const query: any = {};
    if (fname) {
      query.fname = { $regex: fname, $options: 'i' };
    }
    if (phone_number) {
      query.phone_number = { $regex: phone_number, $options: 'i' };
    }
    if (firma) {
      query.firma = { $regex: firma, $options: 'i' };
    }

    return this.clientModel.find(query).exec();
  }

  async findById(id: string) {
    checkId(id);
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Mijoz topilmadi!');
    return client;
  }

  async update(id: string, updateClientDto: UpdateClientDto) {
    checkId(id);
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Mijoz topilmadi!');
    const { fname, phone_number, firma, type, location } = updateClientDto;

    if (fname) {
      client.fname = fname;
    }
    if (phone_number) {
      client.phone_number = phone_number;
    }
    if (firma) {
      client.firma = firma;
    }
    if (type) {
      client.type = type;
    }
    if (location) {
      client.location = location;
    }

    return this.clientModel.findByIdAndUpdate(id, client);
  }

  async remove(id: string) {
    checkId(id);
    const client = await this.clientModel.findById(id);
    if (!client) throw new NotFoundException('Mijoz topilmadi!');
  }
}
