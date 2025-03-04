import { Injectable } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateMedicalRecordRequest } from './dto/create-medical-record.request';
import { UpdateMedicalRecordRequest } from './dto/update-medical-record.request';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createMedicalRecord(data: CreateMedicalRecordRequest) {
    return this.prismaService.medicalRecord.create({
      data: {
        patientId: data.patientId,
        diagnosis: data.diagnosis,
        treatment: data.treatment,
        notes: data.notes,
        attachments: data.attachments || [],
      },
    });
  }

  async getMedicalRecordById(id: string) {
    return this.prismaService.medicalRecord.findUnique({ where: { id } });
  }

  async updateMedicalRecord(id: string, data: UpdateMedicalRecordRequest) {
    return this.prismaService.medicalRecord.update({
      where: { id },
      data,
    });
  }

  async deleteMedicalRecord(id: string) {
    return this.prismaService.medicalRecord.delete({ where: { id } });
  }
}