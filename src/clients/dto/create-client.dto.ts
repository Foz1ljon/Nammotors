import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsNotEmpty, IsString } from 'class-validator';

export class CreateClientDto {
  @ApiProperty({ type: String, description: 'First Name', example: 'John' })
  @IsString()
  @IsNotEmpty()
  fname: string;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    example: '+1234567890',
  })
  @IsString()
  @IsPhoneNumber('UZ')
  phone_number: string;

  @ApiProperty({ type: String, description: 'Firma', example: 'ABC Corp' })
  @IsString()
  @IsNotEmpty()
  firma: string;

  @ApiProperty({ type: String, description: 'Type', example: 'Customer' })
  @IsString()
  @IsNotEmpty()
  type: string;

  @ApiProperty({ type: String, description: 'Location', example: 'New York' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    type: String,
    description: 'Admin id',
    example: '3f09c0452cg54',
  })
  @IsNotEmpty()
  @IsString()
  admin: string;
}
