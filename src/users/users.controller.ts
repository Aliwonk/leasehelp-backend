import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { Role } from 'src/auth/guard/roles-auth.decorator';
import { RolesGuard } from 'src/auth/guard/roles.guard';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

@Controller('user')
export class UsersController {
  constructor(private userService: UsersService) {}
  @Role('ADMIN')
  @UseGuards(RolesGuard)
  @Get('all')
  async getAllUser(): Promise<User[]> {
    return await this.userService.getAllUser();
  }

  @Role('USER' || 'ADMIN')
  @UseGuards(RolesGuard)
  @Get(':id')
  async getOneUser(@Param('id') id: number): Promise<User> {
    return this.userService.getUserById(id);
  }

  @Role('USER')
  @UseGuards(RolesGuard)
  @Post('update/:id')
  async updateUser(@Param('id') id: number) {
    return id;
  }
}
