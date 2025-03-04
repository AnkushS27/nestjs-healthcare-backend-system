import { Injectable } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateAppointmentRequest } from './dto/create-appointment.request';
import { UpdateAppointmentRequest } from './dto/update-appointment.request';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createAppointment(data: CreateAppointmentRequest) {
    return this.prismaService.appointment.create({
      data: {
        doctorId: data.doctorId,
        patientId: data.patientId,
        scheduledAt: new Date(data.scheduledAt),
        endTime: new Date(data.endTime),
        status: data.status || 'SCHEDULED',
        type: data.type || 'Regular Checkup',
        notes: data.notes,
        location: data.location,
      },
    });
  }

  async getAppointmentById(id: string) {
    return this.prismaService.appointment.findUnique({ where: { id } });
  }

  async updateAppointment(id: string, data: UpdateAppointmentRequest) {
    return this.prismaService.appointment.update({
      where: { id },
      data: {
        ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
        ...(data.endTime && { endTime: new Date(data.endTime) }),
        ...(data.status && { status: data.status }),
        ...(data.type && { type: data.type }),
        ...(data.notes && { notes: data.notes }),
        ...(data.location && { location: data.location }),
      },
    });
  }

  async deleteAppointment(id: string) {
    return this.prismaService.appointment.delete({ where: { id } });
  }
}