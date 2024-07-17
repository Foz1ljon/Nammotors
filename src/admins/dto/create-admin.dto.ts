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
  @IsNotEmpty({ message: 'Ism bo`sh bo`lmasligi kerak!' })
  @IsString()
  fname: string;

  @ApiProperty({
    type: String,
    example: 'Faxriddinov',
    description: 'Last name of the admin',
    required: true,
  })
  @IsNotEmpty({ message: 'Familiya bo`sh bo`lmasligi kerak!' })
  @IsString()
  lname: string;

  @ApiProperty({
    type: String,
    example: 'fozil',
    description: 'Username of the admin',
    required: true,
  })
  @IsNotEmpty({ message: 'Username bo`sh bo`lmasligi kerak!' })
  @IsString()
  username: string;

  @ApiProperty({
    type: String,
    example: 'Fozil0990',
    description: 'Password of the admin',
    required: true,
  })
  @IsNotEmpty({ message: 'Parol bo`sh bo`lmasligi kerak!' })
  @IsString()
  password: string;
}
