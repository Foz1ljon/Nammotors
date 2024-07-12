import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client, ClientSchema } from './schemas/client.schemas';
import { Admin, AdminSchema } from '../admins/schemas/admin.schema';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Client.name, schema: ClientSchema },
      { name: Admin.name, schema: AdminSchema },
    ]),
    JwtModule.register({}),
  ],
  controllers: [ClientsController],
  providers: [ClientsService],
})
export class ClientsModule {}
