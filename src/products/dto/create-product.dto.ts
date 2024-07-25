import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsMongoId,
  IsNumberString,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({ type: String, format: 'binary' })
  img?: any;

  @ApiProperty({ description: 'The brand of the product', example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  marka: string;

  @ApiProperty({ description: 'Product count', example: '234' })
  @IsNumberString()
  @IsNotEmpty()
  count: string;

  @ApiProperty({ description: 'Product price', example: '12000' })
  @IsNumberString()
  @IsNotEmpty()
  price: string;

  @ApiProperty({
    description: 'The power rating of the product in kilowatts',
    example: '200kW',
  })
  @IsString()
  @IsNotEmpty()
  kwt: string;

  @ApiProperty({
    description: 'The turnover of the product',
    example: '5000 units',
  })
  @IsString()
  @IsNotEmpty()
  turnover: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsMongoId()
  @IsNotEmpty()
  category: string;

  @ApiProperty({
    description: 'The location of the product',
    example: 'Warehouse A',
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
