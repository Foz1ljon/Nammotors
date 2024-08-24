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
  @IsString({ message: '1' })
  @IsNotEmpty({ message: '1' })
  marka: string;

  @ApiProperty({ description: 'Product count', example: '234' })
  @IsNumberString()
  @IsNotEmpty({ message: '2' })
  count: string;

  @ApiProperty({ description: 'Product price', example: '12000' })
  @IsNumberString()
  @IsNotEmpty({ message: '3' })
  price: string;

  @ApiProperty({
    description: 'The power rating of the product in kilowatts',
    example: '200kW',
  })
  @IsNotEmpty({ message: '4' })
  @IsNumberString()
  kwt: string;

  @ApiProperty({
    description: 'The turnover of the product',
    example: '5000 units',
  })
  @IsString({ message: '5' })
  @IsNotEmpty({ message: '5' })
  turnover: string;

  @ApiProperty({
    description: 'The volume of the product',
    example: '200',
  })
  @IsNotEmpty({ message: '6' })
  @IsString({ message: '6' })
  m3: string;

  @ApiProperty({
    description: 'The metr/height of the product',
    example: '500',
  })
  @IsNotEmpty({ message: '7' })
  @IsString({ message: '7' })
  mh: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsMongoId()
  @IsNotEmpty({ message: '8' })
  category: string;

  @ApiProperty({
    description: 'The location of the product',
    example: 'Warehouse A',
  })
  @IsString({ message: '9' })
  @IsNotEmpty({ message: '9' })
  location: string;
}
