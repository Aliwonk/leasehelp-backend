import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Files } from './entities/files.entity';
import { FilesService } from './files.service';
import { FilesController } from './files.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Files]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => {
        return {
          secret: config.get<string>('JWT_PRIVATE_KEY'),
          signOptions: {
            expiresIn: config.get<string | number>('JWT_EXPIRESIN'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [FilesService],
  controllers: [FilesController],
})
export class FilesModule {}
