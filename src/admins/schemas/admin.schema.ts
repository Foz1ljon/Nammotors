import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Client } from '../../clients/schemas/client.schemas';
import mongoose, { HydratedDocument } from 'mongoose';

export type AdminDocument = HydratedDocument<Admin>;

@Schema({ versionKey: false })
export class Admin {
  @ApiProperty({ type: String, description: 'The image URL' })
  @Prop({ type: String })
  image: string;

  @ApiProperty({
    type: String,
    description: 'First name of the admin',
    required: true,
  })
  @Prop({ type: String, required: true })
  fname: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the admin',
    required: true,
  })
  @Prop({ type: String, required: true })
  lname: string;

  @ApiProperty({
    type: String,
    description: 'Username of the admin',
    required: true,
  })
  @Prop({ type: String, required: true })
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of the admin',
    required: true,
  })
  @Prop({ type: String, required: true })
  password: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is the admin a super admin?',
    default: false,
  })
  @Prop({ type: Boolean, default: false })
  super: boolean;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Client' }] })
  clients: Client[];
}

export const AdminSchema = SchemaFactory.createForClass(Admin);
