import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateAppointmentRequest } from './dto/create-appointment.request';
import { UpdateAppointmentRequest } from './dto/update-appointment.request';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createAppointment(data: CreateAppointmentRequest) {
    try {
      return await this.prismaService.appointment.create({
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
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new HttpException('Invalid doctorId or patientId', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create appointment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentById(id: string) {
    try {
      return await this.prismaService.appointment.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch appointment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAppointment(id: string, data: UpdateAppointmentRequest) {
    try {
      return await this.prismaService.appointment.update({
        where: { id },
        data: {
          ...(data.scheduledAt && { scheduledAt: new Date(data.scheduledAt) }),
          ...(data.endTime && { endTime: new Date(data.endTime) }),
          ...(data.status && { status: data.status }),
          ...(data.type && { type: data.type }),
          ...(data.notes && { notes: data.notes }),
          ...(data.location && { location: data.location }),
          ...(data.reminderSent !== undefined && { reminderSent: data.reminderSent }),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to update appointment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAppointment(id: string) {
    try {
      return await this.prismaService.appointment.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Appointment not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete appointment', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsByFilter(filter: Prisma.AppointmentWhereInput) {
    try {
      return await this.prismaService.appointment.findMany({
        where: filter,
        include: { doctor: { include: { user: true } }, patient: { include: { user: true } } },
      });
    } catch (err) {
      throw new HttpException('Failed to fetch appointments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAppointmentsForDateRange(start: Date, end: Date) {
    try{
      return await this.prismaService.appointment.findMany({
        where: {
          scheduledAt: {
            gte: start,
            lte: end,
          },
        },
        include: {
          doctor: { include: { user: true } }, 
          patient: { include: { user: true } }, 
        },
      });
    } catch (err) {
      throw new HttpException('Failed to fetch appointments', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}