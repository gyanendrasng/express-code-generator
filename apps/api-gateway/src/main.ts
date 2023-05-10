import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.enableCors({
    origin: [/http:\/\/127.0.0.1:*/, /http:\/\/localhost:*/],
    credentials: true,
  });
  app.use(cookieParser());
  app.use(helmet());
  app.setGlobalPrefix('api/v1');
  await app.listen(3000);
}
bootstrap();
