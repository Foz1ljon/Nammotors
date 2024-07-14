import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateLocationDto {
  @ApiProperty({ example: 'Toshkent', description: 'Location name' })
  @IsOptional()
  @IsString()
  name?: string;
  @ApiProperty({ example: '3t4-cmmocjri', description: 'Product id' })
  @IsOptional()
  @IsString()
  productId?: string;
  @ApiProperty({ example: '66', description: 'Product count' })
  @IsOptional()
  @IsNumber()
  count?: number;
}
