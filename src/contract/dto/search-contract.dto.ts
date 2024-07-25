import { ApiProperty } from '@nestjs/swagger';

export class FindContDto {
  @ApiProperty({
    type: String,
    example: '23445',
    description: 'Search by all column',
  })
  query?: string;
}
