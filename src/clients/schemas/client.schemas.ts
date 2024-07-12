import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Admin } from '../../admins/schemas/admin.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema()
export class Client {
  @ApiProperty({ type: String, description: 'First Name', example: 'John' })
  @Prop({ type: String, required: true })
  fname: string;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    example: '+1234567890',
  })
  @Prop({ type: String, required: true })
  phone_number: string;

  @ApiProperty({ type: Boolean, description: 'Active Status', default: false })
  @Prop({ type: Boolean, default: false })
  active: boolean;

  @ApiProperty({ type: String, description: 'Firma', example: 'ABC Corp' })
  @Prop({ type: String, required: true })
  firma: string;

  @ApiProperty({ type: String, description: 'Type', example: 'Customer' })
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({ type: String, description: 'Location', example: 'New York' })
  @Prop({ type: String, required: true })
  location: string;

  @ApiProperty({
    type: String,
    description: 'Admin',
    example: 'admin@example.com',
  })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Admin', required: true })
  admin: Admin;
}

export const ClientSchema = SchemaFactory.createForClass(Client);
