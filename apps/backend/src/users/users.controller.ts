import { Controller, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getAllUsers() {
    return this.usersService.getAllUsers();
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.usersService.getUser(id);
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updates: any) {
    return this.usersService.updateUser(id, updates);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    return this.usersService.deleteUser(id);
  }
}
