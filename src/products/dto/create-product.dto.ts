import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    type: String,
    format: 'binary',
  })
  img: any;

  @ApiProperty({
    description: 'The brand of the product',
    example: 'Toyota',
  })
  @IsString()
  readonly marka: string;

  @ApiProperty({
    description: 'The power rating of the product in kilowatts',
    example: '200kW',
  })
  @IsString()
  readonly kwt: string;

  @ApiProperty({
    description: 'The turnover of the product',
    example: '5000 units',
  })
  @IsString()
  readonly turnover: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsString()
  readonly category: string;

  @ApiProperty({
    description: 'The location of the product',
    example: 'Warehouse A',
  })
  @IsString()
  readonly location: string;
}
