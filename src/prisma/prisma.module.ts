import { Module } from '@nestjs/common';
import { MainPrismaService } from './main-prisma.service';
import { LogsPrismaService } from './logs-prisma.service';

@Module({
  providers: [MainPrismaService, LogsPrismaService],
  exports: [MainPrismaService, LogsPrismaService],
})
export class PrismaModule { }