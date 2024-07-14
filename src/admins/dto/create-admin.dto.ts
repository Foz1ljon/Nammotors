import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ type: String, format: 'binary' })
  image: any;

  @ApiProperty({
    type: String,
    example: 'Fozil',
    description: 'First name of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  fname: string;

  @ApiProperty({
    type: String,
    example: 'Faxriddinov',
    description: 'Last name of the admin',
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  lname: string;

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
