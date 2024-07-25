import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/schemas/product.schemas';
import { Admin } from '../../admins/schemas/admin.schema';
import { Client } from '../../clients/schemas/client.schemas';

@Schema({ versionKey: false })
export class Contract extends Document {
  @ApiProperty({
    description: 'The product associated with the contract',
    type: [mongoose.Schema.Types.ObjectId],
  })
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Product',
    required: true,
  })
  product: Product[];

  @ApiProperty({
    description: 'The vendor (Admin) associated with the contract',
    type: mongoose.Schema.Types.ObjectId,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  })
  vendor: Admin;

  @ApiProperty({
    description: 'The client associated with the contract',
    type: mongoose.Schema.Types.ObjectId,
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true,
  })
  client: Client;

  @ApiProperty({
    description: 'Discount applied to the contract',
    example: 10,
    default: 0,
  })
  @Prop({ type: Number, default: 0 })
  discount: number;

  @ApiProperty({
    description: 'Price of the contract',
    example: '100.00',
  })
  @Prop({ type: Number, required: true })
  price: number;

  @ApiProperty({
    description: 'Payment type for the contract',
    example: 'cash',
    default: 'cash',
  })
  @Prop({ type: String, default: 'cash' })
  paytype: string;

  @ApiProperty({
    description: 'Creation date of the contract',
    example: '2023-07-19T18:30:00Z',
    default: Date.now(),
  })
  @Prop({ type: Date, default: Date.now })
  createAt: Date;
}

export const ContractSchema = SchemaFactory.createForClass(Contract);
