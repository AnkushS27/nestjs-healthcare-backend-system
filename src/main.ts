import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser'; 
import { ApiLoggingInterceptor } from './logging/interceptors/api-logging.interceptor';
import { ErrorLoggingFilter } from './logging/filters/error-logging.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));

  app.use(cookieParser()); 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(app.get(ApiLoggingInterceptor)); // Global API logging
  app.useGlobalFilters(app.get(ErrorLoggingFilter)); // Global error logging

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
