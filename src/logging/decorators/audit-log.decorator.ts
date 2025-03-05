import { SetMetadata } from '@nestjs/common';
import { AuditAction as PrismaAuditAction } from 'prisma/generated/logs';

export const AUDIT_ACTION_KEY = 'auditAction';
export const AuditActionDecorator = (action: PrismaAuditAction) => SetMetadata(AUDIT_ACTION_KEY, action);