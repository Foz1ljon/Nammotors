import { ApiProperty } from '@nestjs/swagger';
import { IsPhoneNumber, IsString, IsOptional } from 'class-validator';

export class UpdateClientDto {
  @ApiProperty({ type: String, description: 'First Name', example: 'John' })
  @IsOptional()
  @IsString()
  fname?: string;

  @ApiProperty({
    type: String,
    description: 'Phone Number',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @IsPhoneNumber('UZ')
  phone_number?: string;

  @ApiProperty({ type: String, description: 'Firma', example: 'ABC Corp' })
  @IsOptional()
  @IsString()
  firma?: string;

  @ApiProperty({ type: String, description: 'Type', example: 'Customer' })
  @IsOptional()
  @IsString()
  type?: string;

  @ApiProperty({ type: String, description: 'Location', example: 'New York' })
  @IsOptional()
  @IsString()
  location?: string;
}
