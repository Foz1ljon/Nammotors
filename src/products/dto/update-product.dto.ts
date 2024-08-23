import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({ type: String, format: 'binary', required: false })
  @IsOptional()
  img?: any;

  @ApiProperty({
    description: 'The brand of the product',
    example: 'Toyota',
    required: false,
  })
  @IsOptional()
  @IsString()
  marka?: string;

  @ApiProperty({
    description: 'The count of the product',
    example: '5000 ',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly count?: string;

  @ApiProperty({
    description: 'The price of the product',
    example: '5000',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly price?: string;

  @ApiProperty({
    description: 'The power rating of the product in kilowatts',
    example: '200kW',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly kwt?: string;

  @ApiProperty({
    description: 'The turnover of the product',
    example: '5000 units',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly turnover?: string;

  @ApiProperty({
    description: 'The volume of the product',
    example: '200',
  })
  @IsOptional()
  @IsString()
  m3?: string;

  @ApiProperty({
    description: 'The metr/height of the product',
    example: '500',
  })
  @IsOptional()
  @IsString()
  mh?: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly category?: string;

  @ApiProperty({
    description: 'The location of the product',
    example: 'Warehouse A',
    required: false,
  })
  @IsOptional()
  @IsString()
  readonly location?: string;
}
