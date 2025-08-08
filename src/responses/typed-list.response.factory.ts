import { Expose, Type } from 'class-transformer';
import { IListResponse } from '../interfaces/list-response.interface';
import { ApiProperty } from '@nestjs/swagger';

type Constructor<T = unknown> = new (...args: any[]) => T;

export function TypedListResponseFactory<T>(ListClass: Constructor<T>) {
  class TypedList implements IListResponse<T> {
    @Expose()
    @ApiProperty({ example: 1 })
    total: number;

    @Expose()
    @Type(() => ListClass)
    @ApiProperty({ type: ListClass, isArray: true })
    data: T[];
  }
  return TypedList;
}
