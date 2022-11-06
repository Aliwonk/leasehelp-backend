import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: { origin: '*' },
  });
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT');

  await app.listen(port, () => {
    console.log(`Server work on port: ${port}`);
  });
}
bootstrap();
