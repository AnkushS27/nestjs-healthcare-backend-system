import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { AppointmentsService } from '../appointments/appointments.service';
import { DoctorsService } from '../doctors/doctors.service';
import { LoggingService } from '../logging/logging.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly appointmentsService: AppointmentsService,
    private readonly doctorsService: DoctorsService,
    private readonly loggingService: LoggingService, 
    private readonly usersService: UsersService,
  ) {}

  // Daily patient appointment reminders at 8:00 AM
  @Cron(CronExpression.EVERY_DAY_AT_8AM)
  async sendPatientAppointmentReminders() {
    this.logger.log('Running daily appointment reminders...');

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);

    const appointments = await this.appointmentsService.getAppointmentsForDateRange(
      tomorrow,
      tomorrow,
    );

    for (const appointment of appointments) {
        if (!appointment.reminderSent && appointment.status === 'SCHEDULED') {
            const patient = await this.usersService.getUser({ id: appointment.patient.userId });
            if (patient.notificationPrefs?.appointmentReminder) {
                const message = `Reminder: Your appointment with Dr. ${appointment.doctor.user.name} is scheduled for ${appointment.scheduledAt.toLocaleString()}.`;
                this.logger.log(`Sending reminder for appointment ${appointment.id} to patient ${appointment.patientId}`);
                await this.sendNotification(appointment.patient.userId, message);
                await this.appointmentsService.updateAppointment(appointment.id, { reminderSent: true });
            }
        }
    }
  }

  // Weekly doctor follow-up notifications every Monday at 9:00 AM
  @Cron(CronExpression.EVERY_WEEKDAY)
  async sendDoctorFollowUpNotifications() {
    this.logger.log('Running weekly follow-up notifications...');

    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);

    const doctors = await this.doctorsService.getAllDoctors();
    for (const doctor of doctors) {
      const reminders = await this.getFollowUpRemindersForDoctor(doctor.id, today, nextWeek);
      for (const reminder of reminders) {
        const doctorUser = await this.usersService.getUser({ id: doctor.userId });
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
      }
    }
  }

  // Helper methods (to be implemented or adjusted based on service methods)
  private async getAppointmentsForDateRange(start: Date, end: Date) {
    return this.appointmentsService.getAppointmentsByFilter({
      scheduledAt: { gte: start, lte: end },
    });
  }

  private async getFollowUpRemindersForDoctor(doctorId: string, start: Date, end: Date) {
    return this.doctorsService.getFollowUpRemindersByFilter(doctorId, {
      dueDate: { gte: start, lte: end },
    });
  }

  private async sendNotification(userId: string, message: string) {
    // Placeholder: Integrate with actual notification system later (e.g., WhatsApp, email)
    this.logger.log(`Notification sent to user ${userId}: ${message}`);

    // Log to notification_logs
    await this.loggingService.logNotification({
      userId,
      channel: 'IN_APP', // Adjust as needed
      notificationType: 'appointment_reminder',
      content: message,
      status: 'SENT',
    });
  }
}