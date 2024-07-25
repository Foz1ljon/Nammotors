import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ type: String, format: 'binary' })
  image: any;
  @ApiProperty({ type: String, description: 'The image URL' })
  @ApiProperty({
    type: String,
    example: 'Foziljon',
    description: 'First name of the admin',
  })
  @IsOptional()
  @IsString()
  fname?: string;

  @ApiProperty({
    type: String,
    example: 'Faxriddinov',
    description: 'Last name of the admin',
  })
  @IsOptional()
  @IsString()
  lname?: string;

  @ApiProperty({
    type: String,
    example: 'fozil09',
    description: 'Username of the admin',
  })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({
    type: String,
    example: 'Fozil0993',
    description: 'Password of the admin',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
