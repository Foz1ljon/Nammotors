import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
  @ApiProperty({
    description: 'The brand of the product',
    example: 'Toyota',
  })
  @IsOptional()
  @IsString()
  readonly marka?: string;

  @ApiProperty({
    description: 'The power rating of the product in kilowatts',
    example: '200kW',
  })
  @IsOptional()
  @IsString()
  readonly kwt?: string;

  @ApiProperty({
    description: 'The turnover of the product',
    example: '5000 units',
  })
  @IsOptional()
  @IsString()
  readonly turnover?: string;

  @ApiProperty({
    description: 'The category of the product',
    example: 'Electronics',
  })
  @IsOptional()
  @IsString()
  readonly category?: string;

  @ApiProperty({
    description: 'The location of the product',
    example: 'Warehouse A',
  })
  @IsOptional()
  @IsString()
  readonly location?: string;
}
