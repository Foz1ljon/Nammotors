import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { ContractService } from './contract.service';
import { ContractController } from './contract.controller';
import { Contract, ContractSchema } from './schemas/contract.schemas';
import { Admin, AdminSchema } from '../admins/schemas/admin.schema';
import { Product, ProductSchema } from '../products/schemas/product.schemas';
import { Client, ClientSchema } from '../clients/schemas/client.schemas';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Contract.name, schema: ContractSchema },
      { name: Admin.name, schema: AdminSchema },
      { name: Product.name, schema: ProductSchema },
      { name: Client.name, schema: ClientSchema },
    ]),
    JwtModule,
  ],
  controllers: [ContractController],
  providers: [ContractService],
})
export class ContractModule {}
