import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Product } from '../../products/schemas/product.schemas';
import mongoose from 'mongoose';

@Schema({ versionKey: false })
export class Category {
  @Prop({ type: String, required: true })
  name: string;
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }] })
  products: Product[];
}

export const CategorySchema = SchemaFactory.createForClass(Category);
