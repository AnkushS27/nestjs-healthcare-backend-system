import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { Request, Response } from 'express';
import { Prisma } from 'prisma/generated/logs';

@Injectable()
export class ApiLoggingInterceptor implements NestInterceptor {
  constructor(private readonly loggingService: LoggingService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();
    const startTime = Date.now();

    return next.handle().pipe(
      tap(() => {
        const responseTime = Date.now() - startTime;
        const logData: Prisma.ApiLogCreateInput = {
          timestamp: new Date(),
          userId: request.user?.id?.toString(),
          userRole: request.user?.role,
          ipAddress: request.ip,
          method: request.method,
          endpoint: request.path,
          statusCode: response.statusCode,
          responseTime,
          userAgent: request.headers['user-agent'],
          requestHeaders: JSON.stringify(request.headers), // Sanitize sensitive data
          requestBody: JSON.stringify(request.body), // Sanitize sensitive data
          responseSize: response.get('content-length') ? parseInt(response.get('content-length'), 10) : null,
          referrer: request.headers['referer'],
        };
        this.loggingService.logApiRequest(logData);
      }),
    );
  }
}