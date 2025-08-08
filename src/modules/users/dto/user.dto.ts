import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsUUID, MaxLength } from 'class-validator';
export class UserDto {
  @ApiProperty({ example: '123e4567-e89b-12d3-a456-426614174000' })
  @IsUUID()
  id: string;

  @ApiProperty({ example: 'hashedPassword123' })
  @IsString()
  @MaxLength(255, { message: 'Password too long. Maximum is 255 symbols.' })
  password: string;

  @ApiProperty({ example: 'Max' })
  @IsString()
  @MaxLength(255, { message: 'Name too long. Maximum is 255 symbols.' })
  name: string;

  @ApiProperty({ example: 'someemail@test.com' })
  @IsEmail()
  @MaxLength(255, { message: 'Email too long. Maximum is 255 symbols.' })
  email: string;
}
