import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerService } from './scheduler.service';
import { AppointmentsModule } from '../appointments/appointments.module';
import { DoctorsModule } from '../doctors/doctors.module';
import { LoggingModule } from '../logging/logging.module';

@Module({
  imports: [
    ScheduleModule.forRoot(), // Enable cron jobs
    AppointmentsModule,
    DoctorsModule,
    LoggingModule,
  ],
  providers: [SchedulerService],
})
export class SchedulerModule {}