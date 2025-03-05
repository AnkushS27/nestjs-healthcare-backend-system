import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateDoctorRequest } from './dto/create-doctor.request';
import { UpdateDoctorRequest } from './dto/update-doctor.request';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class DoctorsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createDoctor(userId: string, data: CreateDoctorRequest) {
    try {
      return await this.prismaService.doctor.create({
        data: {
          userId,
          specialization: data.specialization,
          licenseNumber: data.licenseNumber,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2002') {
          throw new HttpException('License number already exists', HttpStatus.CONFLICT);
        }
        if (err.code === 'P2003') {
          throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
        }
      }
      throw new HttpException('Failed to create doctor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getDoctorById(id: string) {
    try {
      return await this.prismaService.doctor.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch doctor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateDoctor(id: string, data: UpdateDoctorRequest) {
    try {
      return await this.prismaService.doctor.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
        }
        if (err.code === 'P2002') {
          throw new HttpException('License number already exists', HttpStatus.CONFLICT);
        }
      }
      throw new HttpException('Failed to update doctor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteDoctor(id: string) {
    try {
      return await this.prismaService.doctor.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Doctor not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete doctor', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllDoctors() {
    try {
      return await this.prismaService.doctor.findMany({ include: { user: true } });
    } catch (err) {
      throw new HttpException('Failed to fetch doctors', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getFollowUpRemindersByFilter(doctorId: string, filter: Prisma.FollowUpReminderWhereInput) {
    try {
      return await this.prismaService.followUpReminder.findMany({
        where: { doctorId, ...filter },
      });
    } catch (err) {
      throw new HttpException('Failed to fetch follow-up reminders', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async createFollowUpReminder(doctorId: string, data: Prisma.FollowUpReminderCreateInput) {
    try {
      return await this.prismaService.followUpReminder.create({
        data,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new HttpException('Invalid doctorId', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create follow-up reminder', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}