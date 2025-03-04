import { Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { PrismaModule } from '../prisma/prisma.module';
import { ApiLoggingInterceptor } from './interceptors/api-logging.interceptor';
import { ErrorLoggingFilter } from './filters/error-logging.filter';
import { AuditLoggingInterceptor } from './interceptors/audit-logging.interceptor';

@Module({
  imports: [PrismaModule],
  providers: [LoggingService, ApiLoggingInterceptor, AuditLoggingInterceptor, ErrorLoggingFilter],
  exports: [LoggingService, ApiLoggingInterceptor, AuditLoggingInterceptor, ErrorLoggingFilter],
})
export class LoggingModule {}