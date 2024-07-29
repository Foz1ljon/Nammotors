import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsBoolean,
  IsNotEmpty,
  IsPhoneNumber,
} from 'class-validator';
import { Admin } from '../../admins/schemas/admin.schema';

export type ClientDocument = HydratedDocument<Client>;

@Schema({ versionKey: false })
export class Client {
  @ApiProperty({ type: String, description: 'First Name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  fname: string;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    example: '+1234567890',
  })
  @IsString()
  @IsPhoneNumber()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  phone_number: string;

  @ApiProperty({ type: Boolean, description: 'Active Status', default: false })
  @IsBoolean()
  @Prop({ type: Boolean, default: false })
  active: boolean;

  @ApiProperty({ type: String, description: 'Firma', example: 'ABC Corp' })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  firma: string;

  @ApiProperty({ type: String, description: 'Type', example: 'Customer' })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  type: string;

  @ApiProperty({ type: String, description: 'Location', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  @Prop({ type: String, required: true })
  location: string;

  @ApiProperty({
    description: 'The admin of the client',
    example: '9004gsdsdmsd',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  })
  admin: Admin;
}

export const ClientSchema = SchemaFactory.createForClass(Client);

// Optionally, you can add indexes
ClientSchema.index({ phone_number: 1 });
ClientSchema.index({ admin: 1 });
