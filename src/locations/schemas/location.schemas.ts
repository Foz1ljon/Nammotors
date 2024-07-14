import { Prop, Schema } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';

@Schema({ versionKey: false })
export class Location {
  @ApiProperty({ example: 'Toshkent', description: 'Location name' })
  @Prop({ type: String, required: true })
  name: string;
  @ApiProperty({ example: '3t4-cmmocjri', description: 'Product id' })
  @Prop({ type: String, required: true })
  productId: string;
  @ApiProperty({ example: '66', description: 'Product count' })
  @Prop({ type: Number, required: true })
  count: number;
}
