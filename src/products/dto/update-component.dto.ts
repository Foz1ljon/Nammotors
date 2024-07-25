import { ApiProperty, ApiConsumes } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';

@ApiConsumes('multipart/form-data')
export class UpdateComponentDto {
  @ApiProperty({
    description: 'Binary file for the image associated with the component',
    type: 'string',
    format: 'binary',
    required: false,
  })
  @IsOptional()
  image?: any;

  @ApiProperty({
    description: 'Name of the component',
    example: 'Resistor',
    required: false,
  })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({
    description: 'Brand or manufacturer of the component',
    example: 'Texas Instruments',
    required: false,
  })
  @IsString()
  @IsOptional()
  marka?: string;

  @ApiProperty({
    description: 'Quantity of the component available',
    example: '100',
    default: '0',
    required: false,
  })
  @IsString()
  @IsOptional()
  count?: string;

  @ApiProperty({
    description: 'Location or storage area of the component',
    example: 'Shelf 3, Bin 5',
    required: false,
  })
  @IsString()
  @IsOptional()
  location?: string;
}
