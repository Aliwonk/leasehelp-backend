import { Module } from '@nestjs/common';
import { SubscriptionsService } from './subscriptions.service';
import { SubscriptionsController } from './subscriptions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Subscriptions } from './entities/subscriptions.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([Subscriptions]),
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
  providers: [SubscriptionsService],
  controllers: [SubscriptionsController],
  exports: [SubscriptionsService],
})
export class SubscriptionsModule {}
