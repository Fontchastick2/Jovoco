import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() user: Partial<User>): Promise<User> {
    return this.usersService.create(user);
  }

  @Get()
  async findAll(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Get(':userId')
  async findById(@Param('userId') userId: string): Promise<User | null> {
    return this.usersService.findById(userId);
  }

  @Post('login')
  async login(@Body() body: { email: string; passwordHash: string }): Promise<User | null> {
    return this.usersService.login(body.email, body.passwordHash);
  }

  @Post(':userId/logout')
  async logout(@Param('userId') userId: string): Promise<void> {
    return this.usersService.logout(userId);
  }

  @Put(':userId')
  async updateProfile(
    @Param('userId') userId: string,
    @Body() updateData: Partial<User>,
  ): Promise<User | null> {
    return this.usersService.updateProfile(userId, updateData);
  }

  @Delete(':userId')
  async delete(@Param('userId') userId: string): Promise<void> {
    return this.usersService.delete(userId);
  }
}
