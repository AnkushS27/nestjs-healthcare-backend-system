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
    .setDescription(`
      **Healthcare API Documentation**

      This API manages healthcare operations with Role-Based Access Control (RBAC) and Attribute-Based Access Control (ABAC).

      **Authentication Instructions:**
      - To authenticate, use the \`POST /auth/login\` endpoint with your credentials (e.g., \`{"email": "user@example.com", "password": "password123"}\`).
      - This sets a JWT cookie (\`Authentication\`) in your browser, which is automatically included in subsequent requests.
      - No manual token input is required in this Swagger UI; simply log in first via \`/auth/login\` and proceed with other requests.
    `)
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document); // Available at /api

  await app.listen(app.get(ConfigService).getOrThrow('PORT'));
}
bootstrap();
