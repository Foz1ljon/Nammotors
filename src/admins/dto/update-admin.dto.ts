import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAdminDto {
  @ApiProperty({ type: String, description: 'The image URL' })
  @ApiProperty({
    type: String,
    description: 'First name of the admin',
  })
  @IsOptional()
  @IsString()
  fname?: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the admin',
  })
  @IsOptional()
  @IsString()
  lname?: string;

  @ApiProperty({
    type: String,
    description: 'Username of the admin',
  })
  @IsNotEmpty()
  @IsString()
  username?: string;

  @ApiProperty({
    type: String,
    description: 'Password of the admin',
  })
  @IsOptional()
  @IsString()
  password?: string;
}
