import {
  Controller,
  HttpStatus,
  Get,
  ClassSerializerInterceptor,
  UseInterceptors,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from '../users.service';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '../../../entities/user.entity';
import { UseResponse } from '../../../decorators/use-response.decorator';
import { UsersResponse } from '../responses/users.response';
import { UserResponse } from '../responses/user.response';
import { Patch } from '@nestjs/common';
import { Body } from '@nestjs/common';
import { UpdateUserDto } from '../dto/update-user.dto';
import { WithAuth } from '../../../decorators/with-auth.decorator';
import { UsersList } from '../types';

@ApiTags('Users')
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @WithAuth()
  @UseResponse(UsersResponse)
  @ApiResponse({ status: HttpStatus.OK, type: UsersResponse })
  async getUsers(): Promise<UsersList> {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  @WithAuth()
  @UseResponse(UserResponse)
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async getUser(@Param('id') id: string): Promise<User> {
    return this.usersService.getUserById(id);
  }

  @Patch(':id')
  @WithAuth()
  @UseResponse(UserResponse)
  @ApiResponse({ status: HttpStatus.OK, type: UserResponse })
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    return this.usersService.updateUser(id, updateUserDto);
  }
}
