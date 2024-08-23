import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateContractDto {
  @ApiProperty({
    description: 'The ID of the product associated with the contract',
    example: '60d0fe4f5311236168a109ca',
  })
  @IsNotEmpty()
  product: string[];

  @ApiProperty({
    description: 'The ID of the client associated with the contract',
    example: '60d0fe4f5311236168a109cc',
  })
  @IsNotEmpty()
  @IsPhoneNumber('UZ')
  client: string;

  @ApiProperty({
    description: 'Discount applied to the contract',
    example: 10,
    default: 0,
  })
  @IsNumber()
  @IsOptional()
  discount: number;

  @ApiProperty({
    description: 'Payment type for the contract',
    example: 'card',
    default: 'cash',
  })
  @IsString()
  @IsOptional()
  paytype: string;
}
