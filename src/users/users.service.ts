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
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      // Return the created user (no role-specific profile creation here)
      return user;
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