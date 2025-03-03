import { Injectable } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateDoctorRequest } from './dto/create-doctor.request';
import { UpdateDoctorRequest } from './dto/update-doctor.request';

@Injectable()
export class DoctorsService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createDoctor(userId: string, data: CreateDoctorRequest) {
    return this.prismaService.doctor.create({
      data: {
        userId,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
      },
    });
  }

  async getDoctorById(id: string) {
    return this.prismaService.doctor.findUnique({ where: { id } });
  }

  async updateDoctor(id: string, data: UpdateDoctorRequest) {
    return this.prismaService.doctor.update({
      where: { id },
      data,
    });
  }

  async deleteDoctor(id: string) {
    return this.prismaService.doctor.delete({ where: { id } });
  }
}