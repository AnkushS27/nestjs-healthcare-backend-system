import { Module } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AccessPoliciesModule } from 'src/access-policies/access-policies.module';
import { LoggingModule } from 'src/logging/logging.module';

@Module({
  imports: [PrismaModule, AccessPoliciesModule, LoggingModule],
  providers: [AppointmentsService],
  controllers: [AppointmentsController],
  exports: [AppointmentsService]
})
export class AppointmentsModule {}
