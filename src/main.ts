import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Logger } from 'nestjs-pino';
import * as cookieParser from 'cookie-parser'; 
import { ApiLoggingInterceptor } from './logging/interceptors/api-logging.interceptor';
import { ErrorLoggingFilter } from './logging/filters/error-logging.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));

  app.use(cookieParser()); 
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  app.useGlobalInterceptors(app.get(ApiLoggingInterceptor)); // Global API logging
  app.useGlobalFilters(app.get(ErrorLoggingFilter)); // Global error logging

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Healthcare API')
    .setDescription('API for managing healthcare operations with RBAC and ABAC')
    .setVersion('1.0')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT-auth', // Name of the security scheme
    )
    .addCookieAuth('Authentication', {
      type: 'apiKey',
      in: 'cookie',
      name: 'Authentication',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Available at /api

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
