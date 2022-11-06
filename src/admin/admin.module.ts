import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.entity';
import { AdminController } from './admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Admin])],
  providers: [AdminService],
  exports: [AdminService],
  controllers: [AdminController],
})
export class AdminModule {}
