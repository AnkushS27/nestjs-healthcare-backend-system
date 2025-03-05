import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { LoggingService } from '../logging.service';
import { Prisma } from 'prisma/generated/logs';

@Catch()
export class ErrorLoggingFilter implements ExceptionFilter {
  constructor(private readonly loggingService: LoggingService) {}

  async catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    // Determine status code and message
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorCode = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = typeof exceptionResponse === 'string' ? exceptionResponse : (exceptionResponse as any).message || message;
      errorCode = (exceptionResponse as any).error || exception.name;
    } else if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      // Handle Prisma-specific errors
      switch (exception.code) {
        case 'P2002': // Unique constraint violation
          status = HttpStatus.CONFLICT;
          message = 'Resource already exists';
          errorCode = 'DUPLICATE_RESOURCE';
          break;
        case 'P2025': // Record not found
          status = HttpStatus.NOT_FOUND;
          message = 'Resource not found';
          errorCode = 'NOT_FOUND';
          break;
        default:
          status = HttpStatus.BAD_REQUEST;
          message = exception.message || 'Database error';
          errorCode = exception.code || 'DATABASE_ERROR';
      }
    } else if (exception instanceof Error) {
      message = exception.message || message;
      errorCode = exception.name || errorCode;
    }

    // Log the error
    const logData: Prisma.ErrorLogCreateInput = {
      timestamp: new Date(),
      userId: request.user?.id?.toString(),
      errorCode,
      errorMessage: message,
      stackTrace: exception.stack || 'No stack trace available',
      severity: status >= 500 ? 'CRITICAL' : 'ERROR',
      source: 'API',
      endpoint: request.path,
      requestId: request.headers['x-request-id']?.toString(),
      metadata: JSON.stringify({
        method: request.method,
        query: request.query,
        body: request.body, // Sanitize sensitive data if needed
      }),
    };

    await this.loggingService.logError(logData);

    // Send response to client
    response.status(status).json({
      statusCode: status,
      message,
      error: errorCode,
      timestamp: new Date().toISOString(),
    });
  }
}