import { Injectable } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreatePatientRequest } from './dto/create-patient.request';
import { UpdatePatientRequest } from './dto/update-patient.request';

@Injectable()
export class PatientsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createPatient(userId: string, data: CreatePatientRequest) {
    return this.prismaService.patient.create({
      data: {
        userId,
        dateOfBirth: new Date(data.dateOfBirth),
        emergencyContact: data.emergencyContact,
      },
    });
  }

  async getPatientById(id: string) {
    return this.prismaService.patient.findUnique({ where: { id } });
  }

  async updatePatient(id: string, data: UpdatePatientRequest) {
    return this.prismaService.patient.update({
      where: { id },
      data: {
        ...(data.dateOfBirth && { dateOfBirth: new Date(data.dateOfBirth) }),
        ...(data.emergencyContact && { emergencyContact: data.emergencyContact }),
      },
    });
  }

  async deletePatient(id: string) {
    return this.prismaService.patient.delete({ where: { id } });
  }
}