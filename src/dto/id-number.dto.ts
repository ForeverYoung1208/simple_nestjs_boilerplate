import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsPositive } from 'class-validator';

export class IdNumberDto {
  @IsInt()
  @IsNotEmpty()
  @IsPositive()
  @Expose()
  @ApiProperty({ example: 1 })
  id: number;
}
