import { Injectable } from '@nestjs/common';
import { User } from '../../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersList } from './types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async getAllUsers(): Promise<UsersList> {
    const query = this.usersRepository.createQueryBuilder('user');
    const [users, count] = await query.getManyAndCount();

    return {
      total: count,
      data: users,
    };
  }

  async getShortUserById(id: string): Promise<User> {
    return this.usersRepository.findOneByOrFail({ id });
  }

  async getUserById(id: string): Promise<User> {
    const query = this.usersRepository.createQueryBuilder('user');
    query.where('user.id = :id', { id });
    const userFull = await query.getOneOrFail();

    return userFull;
  }

  async updateUser(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.usersRepository.findOneByOrFail({ id });
    return this.usersRepository.save({ ...user, ...updateUserDto });
  }
}
