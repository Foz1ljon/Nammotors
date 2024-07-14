import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInAdminDto {
  @ApiProperty({
    type: String,
    example: 'fozil',
    description: 'Username of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: 'Fozil0990',
    description: 'Password of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
