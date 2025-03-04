import { Injectable } from '@nestjs/common';
import { LogsPrismaService } from '../prisma/logs-prisma.service';
import { Prisma } from 'prisma/generated/logs';

@Injectable()
export class LoggingService {
  constructor(private readonly logsPrismaService: LogsPrismaService) {}

  async logApiRequest(data: Prisma.ApiLogCreateInput) {
    return this.logsPrismaService.apiLog.create({ data });
  }

  async logError(data: Prisma.ErrorLogCreateInput) {
    return this.logsPrismaService.errorLog.create({ data });
  }

  async logAudit(data: Prisma.AuditLogCreateInput) {
    return this.logsPrismaService.auditLog.create({ data });
  }

  async logAuth(data: Prisma.AuthLogCreateInput) {
    return this.logsPrismaService.authLog.create({ data });
  }
}
