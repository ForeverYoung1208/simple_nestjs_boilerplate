import { Exclude } from 'class-transformer';
import { TypedListResponseFactory } from '../../../responses/typed-list.response.factory';
import { UserResponse } from './user.response';

@Exclude()
export class UsersResponse extends TypedListResponseFactory(UserResponse) {}
