import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginAdminDto } from 'src/admin/dto/login-admin.dto';
import { AuthService } from './auth.service';
import { LoginUserDto } from './dto/login-user.dto';
import { RegistrationUserDto } from './dto/registration-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() userData: LoginUserDto) {
    return this.authService.login(userData);
  }

  @Post('register')
  async registration(@Body() userData: RegistrationUserDto) {
    return this.authService.registration(userData);
  }

  @Post('admin/login')
  async loginAdmin(@Body() adminData: LoginAdminDto) {
    return this.authService.loginAdmin(adminData);
  }
}
