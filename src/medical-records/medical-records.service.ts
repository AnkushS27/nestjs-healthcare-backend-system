import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateMedicalRecordRequest } from './dto/create-medical-record.request';
import { UpdateMedicalRecordRequest } from './dto/update-medical-record.request';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createMedicalRecord(data: CreateMedicalRecordRequest) {
    try {
      return await this.prismaService.medicalRecord.create({
        data: {
          patientId: data.patientId,
          diagnosis: data.diagnosis,
          treatment: data.treatment,
          notes: data.notes,
          attachments: data.attachments || [],
        },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2003') {
        throw new HttpException('Invalid patientId', HttpStatus.BAD_REQUEST);
      }
      throw new HttpException('Failed to create medical record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getMedicalRecordById(id: string) {
    try {
      return await this.prismaService.medicalRecord.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Medical record not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch medical record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateMedicalRecord(id: string, data: UpdateMedicalRecordRequest) {
    try {
      return await this.prismaService.medicalRecord.update({
        where: { id },
        data,
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Medical record not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to update medical record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteMedicalRecord(id: string) {
    try {
      return await this.prismaService.medicalRecord.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Medical record not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete medical record', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}