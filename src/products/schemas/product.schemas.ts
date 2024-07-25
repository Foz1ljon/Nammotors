import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/schemas/category.schemas';

@Schema({ versionKey: false })
export class Product extends Document {
  @ApiProperty({ description: 'product image ', example: 'photo.img' })
  @Prop({ type: String, required: true })
  img: string;

  @ApiProperty({
    description: 'The brand of the product',
    example: 'Toyota',
  })
  @Prop()
  marka: string;

  @ApiProperty({
    description: 'Component name',
    example: 'Zapchast',
  })
  @Prop()
  @ApiProperty({
    description: 'Product count',
    example: '234',
  })
  @Prop()
  count: string;

  @ApiProperty({
    description: 'Product price',
    example: '12000',
  })
  @Prop()
  price: string;

  @ApiProperty({
    description: 'The power rating of the product in kilowatts',
    example: '200kW',
  })
  @Prop()
  kwt: string;

  @ApiProperty({
    description: 'The turnover of the product',
    example: '5000 units',
  })
  @Prop()
  turnover: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  })
  category: Category;

  @ApiProperty({
    description: 'The location of the product',
    example: 'Warehouse A',
  })
  @Prop({})
  location: string;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
