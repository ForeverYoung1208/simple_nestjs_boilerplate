import { User } from '../../entities/user.entity';

export type UsersList = {
  total: number;
  data: User[];
};
