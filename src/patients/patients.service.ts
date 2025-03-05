import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreatePatientRequest } from './dto/create-patient.request';
import { UpdatePatientRequest } from './dto/update-patient.request';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class PatientsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createPatient(userId: string, data: CreatePatientRequest) {
    try {
      return await this.prismaService.patient.create({
        data: {
          userId,
          dateOfBirth: new Date(data.dateOfBirth),
          emergencyContact: data.emergencyContact,
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new HttpException('Invalid userId', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getPatientById(id: string) {
    try {
      return await this.prismaService.patient.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updatePatient(id: string, data: UpdatePatientRequest) {
    try {
      return await this.prismaService.patient.update({
        where: { id },
        data: {
          ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
          ...(data.emergencyContact && { emergencyContact: data.emergencyContact }),
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to update patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deletePatient(id: string) {
    try {
      return await this.prismaService.patient.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Patient not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete patient', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}