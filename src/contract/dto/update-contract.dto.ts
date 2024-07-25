import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsPositive,
  IsNumberString,
  IsArray,
} from 'class-validator';

export class UpdateContractDto {
  @ApiProperty({
    description: 'The ID of the product associated with the contract',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsArray()
  @IsOptional()
  product?: string[];

  @ApiProperty({
    description: 'The ID of the client associated with the contract',
    example: '60d0fe4f5311236168a109cc',
  })
  @IsString()
  @IsOptional()
  client?: string;

  @ApiProperty({
    description: 'Discount applied to the contract',
    example: 10,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  @IsPositive()
  discount?: number;

  @ApiProperty({
    description: 'Price of the contract',
    example: '100.00',
  })
  @IsNumberString()
  @IsOptional()
  price?: string;

  @ApiProperty({
    description: 'Payment type for the contract',
    example: 'card',
    default: 'cash',
  })
  @IsString()
  @IsOptional()
  paytype?: string;
}
