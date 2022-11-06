import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginAdminDto } from './dto/login-admin.dto';
import { Admin } from './entities/admin.entity';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(Admin)
    private adminRepository: Repository<Admin>,
  ) {}

  async getAdmin(adminData: LoginAdminDto): Promise<Admin> {
    return await this.adminRepository.findOne({
      where: { login: adminData.login, password: adminData.password },
    });
  }
}
