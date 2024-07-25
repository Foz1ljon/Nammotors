import { ApiProperty, ApiConsumes } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumberString,
} from 'class-validator';

@ApiConsumes('multipart/form-data') // Indicates that this DTO is used for multipart/form-data
export class CreateComponentDto {
  @ApiProperty({
    description: 'Binary file for the image associated with the component',
    type: 'string',
    format: 'binary',
  })
  @IsOptional() // File upload is optional; you can change this based on your needs
  image?: any; // Use `any` for the file type; proper handling will be done in the controller

  @ApiProperty({
    description: 'Name of the component',
    example: 'Resistor',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Brand or manufacturer of the component',
    example: 'Texas Instruments',
  })
  @IsString()
  @IsNotEmpty()
  marka: string;

  @ApiProperty({
    description: 'Quantity of the component available',
    example: '100',
    default: '0',
  })
  @IsNumberString()
  @IsNotEmpty()
  count?: string;

  @ApiProperty({
    description: 'Location or storage area of the component',
    example: 'Shelf 3, Bin 5',
  })
  @IsString()
  @IsNotEmpty()
  location: string;
}
