import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CreateUserRequest } from './dto/create-user.request';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createUser(data: CreateUserRequest) {
    try {
      // Create the user with basic fields
      const user = await this.prismaService.user.create({
        data: {
          email: data.email,
          password: await bcrypt.hash(data.password, 10),
          name: data.name,
          role: data.role,
        },
      });

      // Create the role-specific profile based on the user's role
      switch (data.role) {
        case 'ADMIN':
          if (!data.adminData) {
            throw new UnprocessableEntityException('Admin data is required for ADMIN role');
          }
          await this.prismaService.admin.create({
            data: {
              userId: user.id,
              department: data.adminData.department,
            },
          });
          break;

        case 'DOCTOR':
          if (!data.doctorData) {
            throw new UnprocessableEntityException('Doctor data is required for DOCTOR role');
          }
          await this.prismaService.doctor.create({
            data: {
              userId: user.id,
              specialization: data.doctorData.specialization,
              licenseNumber: data.doctorData.licenseNumber,
            },
          });
          break;

        case 'PATIENT':
          if (!data.patientData) {
            throw new UnprocessableEntityException('Patient data is required for PATIENT role');
          }
          await this.prismaService.patient.create({
            data: {
              userId: user.id,
              dateOfBirth: data.patientData.dateOfBirth,
              emergencyContact: data.patientData.emergencyContact,
            },
          });
          break;
      }

      // Return the user with selected fields
      return await this.prismaService.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });
    } catch (err) {
      if (err.code === 'P2002') {
        throw new UnprocessableEntityException('Email already exists');
      }
      throw err;
    }
  }

  async getUser(filter: Prisma.UserWhereUniqueInput) {
    return this.prismaService.user.findUniqueOrThrow({
      where: filter,
      include: {
        admin: true,
        doctor: true,
        patient: true,
      },
    });
  }
}