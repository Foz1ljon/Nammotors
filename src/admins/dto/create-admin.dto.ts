import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    type: String,
    description: 'First name of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  fname: string;

  @ApiProperty({
    type: String,
    description: 'Last name of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lname: string;

  @ApiProperty({
    type: String,
    description: 'Username of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    description: 'Password of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;

  @ApiProperty({
    type: Boolean,
    description: 'Is the admin a super admin?',
    default: false,
  })
  @IsBoolean()
  super: boolean;
}
