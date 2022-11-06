import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { SubscriptionsModule } from 'src/subscriptions/subscriptions.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AdminModule } from 'src/admin/admin.module';

@Module({
  imports: [
    UsersModule,
    AdminModule,
    SubscriptionsModule,
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
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
