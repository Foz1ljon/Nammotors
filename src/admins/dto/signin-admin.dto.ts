import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAdminDto {
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
}
