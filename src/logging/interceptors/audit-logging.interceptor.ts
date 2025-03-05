import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggingService } from '../logging.service';
import { Reflector } from '@nestjs/core';
import { AUDIT_ACTION_KEY } from '../decorators/audit-log.decorator';
import { Request } from 'express';

interface User {
  id: string;
  role: string;
}

declare module 'express' {
  export interface Request {
    user: User;
  }
}

import { Prisma, AuditAction } from 'prisma/generated/logs';

@Injectable()
export class AuditLoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly loggingService: LoggingService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: Request = context.switchToHttp().getRequest();
    const auditAction = this.reflector.get<AuditAction>(AUDIT_ACTION_KEY, context.getHandler());

    if (!auditAction) return next.handle();

    return next.handle().pipe(
      tap((data) => {
        const logData: Prisma.AuditLogCreateInput = {
          timestamp: new Date(),
          userId: request.user.id.toString(),
          userRole: request.user.role,
          action: auditAction,
          resourceType: context.getClass().name.replace('Controller', ''),
          resourceId: data?.id || request.params.id || 'N/A',
          description: `${auditAction} on ${context.getClass().name}`,
          ipAddress: request.ip,
          changes: JSON.stringify({ before: {}, after: data }), // Placeholder; enhance as needed
          success: true,
          additionalInfo: JSON.stringify({}),
        };
        this.loggingService.logAudit(logData);
      }),
    );
  }
}