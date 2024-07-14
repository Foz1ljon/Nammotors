import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateLocationDto {
  @ApiProperty({
    example: 'Toshkent',
    required: true,
    description: 'Location name',
  })
  @IsString()
  name: string;
  @ApiProperty({
    example: '3t4-cmmocjri',
    required: true,
    description: 'Product id',
  })
  @IsString()
  productId: string;
  @ApiProperty({ example: '66', required: true, description: 'Product count' })
  @IsNumber()
  count: number;
}
