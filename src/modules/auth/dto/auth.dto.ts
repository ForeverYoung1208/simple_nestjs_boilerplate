import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthDto {
  @ApiProperty({ example: 'admin@test.com' })
  @IsString()
  email: string;

  @ApiProperty({ example: 'asdfasdf' })
  @IsString()
  password: string;
}
