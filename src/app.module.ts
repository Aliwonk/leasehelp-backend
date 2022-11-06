import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { FilesModule } from './files/files.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { MulterModule } from '@nestjs/platform-express';
import { AdminModule } from './admin/admin.module';

const enviroment = process.env.NODE_ENV || 'development';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${enviroment}.env`,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => ({
        type: 'mysql',
        host: config.get<string>('TYPEORM_HOST'),
        port: config.get<number>('TYPEORM_PORT'),
        database: config.get<string>('TYPEORM_DATABASE'),
        username: config.get<string>('TYPEORM_USERNAME'),
        password: config.get<string>('TYPEORM_PASSWORD'),
        entities: [join(__dirname, '**', '*.entity.js')],
        synchronize: true,
        logging: config.get<boolean>('TYPEORM_LOGGING'),
      }),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        dest: config.get<string>('MULTER_DEST'),
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    FilesModule,
    AuthModule,
    SubscriptionsModule,
    AdminModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
