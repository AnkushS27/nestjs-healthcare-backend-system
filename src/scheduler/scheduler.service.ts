import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from '../doctors/doctors.service';
import { LoggingService } from '../logging/logging.service';
import { UsersService } from '../users/users.service';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly doctorsService: DoctorsService,
    private readonly loggingService: LoggingService,
    private readonly usersService: UsersService,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendPatientAppointmentReminders() {
    this.logger.log('Running daily appointment reminders...');

    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      const appointments = await this.appointmentsService.getAppointmentsForDateRange(
        tomorrow,
        tomorrow,
      );

      for (const appointment of appointments) {
        if (!appointment.reminderSent && appointment.status === 'SCHEDULED') {
          try {
            const patient = await this.usersService.getUser({ id: appointment.patient.userId });
            if (!patient) {
              this.logger.warn(`Skipping reminder for appointment ${appointment.id}: Patient not found`);
              continue;
            }
            if (patient.notificationPrefs?.appointmentReminder) {
              const message = `Reminder: Your appointment with Dr. ${appointment.doctor.user.name} is scheduled for ${appointment.scheduledAt.toLocaleString()}.`;
              this.logger.log(`Sending reminder for appointment ${appointment.id} to patient ${appointment.patientId}`);
              await this.sendNotification(appointment.patient.userId, message);
              await this.appointmentsService.updateAppointment(appointment.id, { reminderSent: true });
            }
          } catch (err) {
            this.logger.error(`Error processing reminder for appointment ${appointment.id}: ${err.message}`);
          }
        }
      }
    } catch (err) {
      this.logger.error(`Failed to run patient appointment reminders: ${err.message}`);
      throw new HttpException('Failed to process appointment reminders', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Cron(CronExpression.EVERY_WEEKDAY)
  async sendDoctorFollowUpNotifications() {
    this.logger.log('Running weekly follow-up notifications...');

    try {
      const today = new Date();
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const doctors = await this.doctorsService.getAllDoctors();
      for (const doctor of doctors) {
        try {
          const doctorUser = await this.usersService.getUser({ id: doctor.userId });
          if (!doctorUser) {
            this.logger.warn(`Skipping notifications for doctor ${doctor.id}: User not found`);
            continue;
          }
          if (doctorUser.notificationPrefs?.followUpReminder) {
            const reminders = await this.getFollowUpRemindersForDoctor(doctor.id, today, nextWeek);
            for (const reminder of reminders) {
              if (!reminder.completed) {
                const message = `Follow-up Reminder: Patient ${reminder.patientName} (ID: ${reminder.patientId}) is due on ${reminder.dueDate.toLocaleDateString()}. Description: ${reminder.description}`;
                this.logger.log(`Sending follow-up notification to doctor ${doctor.id} for reminder ${reminder.id}`);
                await this.sendNotification(doctor.userId, message);
              }
            }
          }
        } catch (err) {
          this.logger.error(`Error processing notifications for doctor ${doctor.id}: ${err.message}`);
        }
      }
    } catch (err) {
      this.logger.error(`Failed to run doctor follow-up notifications: ${err.message}`);
      throw new HttpException('Failed to process follow-up notifications', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getAppointmentsForDateRange(start: Date, end: Date) {
    try {
      return await this.appointmentsService.getAppointmentsByFilter({
        scheduledAt: { gte: start, lte: end },
      });
    } catch (err) {
      throw new HttpException('Failed to fetch appointments for date range', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async getFollowUpRemindersForDoctor(doctorId: string, start: Date, end: Date) {
    try {
      return await this.doctorsService.getFollowUpRemindersByFilter(doctorId, {
        dueDate: { gte: start, lte: end },
      });
    } catch (err) {
      throw new HttpException('Failed to fetch follow-up reminders', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private async sendNotification(userId: string, message: string) {
    try {
      this.logger.log(`Notification sent to user ${userId}: ${message}`);
      await this.loggingService.logNotification({
        userId,
        channel: 'IN_APP',
        notificationType: 'appointment_reminder',
        content: message,
        status: 'SENT',
      });
    } catch (err) {
      this.logger.error(`Failed to send notification to user ${userId}: ${err.message}`);
      throw new HttpException('Failed to send notification', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}