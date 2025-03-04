import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging.service';
import { Prisma } from 'prisma/generated/logs';

@Catch()
export class ErrorLoggingFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception instanceof HttpException ? exception.getStatus() : 500;

    const logData: Prisma.ErrorLogCreateInput = {
      timestamp: new Date(),
      userId: request.user?.id?.toString(),
      errorCode: exception.code || 'INTERNAL_SERVER_ERROR',
      errorMessage: exception.message || 'Internal server error',
      stackTrace: exception.stack,
      severity: status >= 500 ? 'CRITICAL' : 'ERROR',
      source: 'API',
      endpoint: request.path,
      requestId: request.headers['x-request-id']?.toString(),
      metadata: JSON.stringify({}),
    };

    this.loggingService.logError(logData);

    response.status(status).json({
      statusCode: status,
      message: exception.message || 'Internal server error',
    });
  }
}