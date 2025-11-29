import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { validate as isValidUUID } from 'uuid';
import { UserService } from '../database/services';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllUsers() {
    const users = this.userService.getAllUsers();
    return users.map((user) => {
      const { password: _password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getUserById(@Param('id') id: string) {
    if (!isValidUUID(id)) {
      throw new BadRequestException('Invalid user ID (not a valid UUID)');
    }

    const user = this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createUser(@Body() createUserDto: CreateUserDto) {
    const user = this.userService.createUser(
      createUserDto.login,
      createUserDto.password,
    );

    const { password: _password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}
