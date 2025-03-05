import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateAccessPolicyRequest } from './dto/create-access-policy.request';
import { UpdateAccessPolicyRequest } from './dto/update-access-policy.request';
import { Prisma } from 'prisma/generated/main';

@Injectable()
export class AccessPoliciesService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createAccessPolicy(data: CreateAccessPolicyRequest) {
    try {
      return await this.prismaService.accessPolicy.create({ data });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new HttpException('Policy name already exists', HttpStatus.CONFLICT);
      }
      throw new HttpException('Failed to create access policy', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAccessPolicyById(id: string) {
    try {
      return await this.prismaService.accessPolicy.findUniqueOrThrow({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Access policy not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to fetch access policy', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async getAllAccessPolicies() {
    try {
      return await this.prismaService.accessPolicy.findMany();
    } catch (err) {
      throw new HttpException('Failed to fetch access policies', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async updateAccessPolicy(id: string, data: UpdateAccessPolicyRequest) {
    try {
      return await this.prismaService.accessPolicy.update({ where: { id }, data });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        if (err.code === 'P2025') {
          throw new HttpException('Access policy not found', HttpStatus.NOT_FOUND);
        }
        if (err.code === 'P2002') {
          throw new HttpException('Policy name already exists', HttpStatus.CONFLICT);
        }
      }
      throw new HttpException('Failed to update access policy', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async deleteAccessPolicy(id: string) {
    try {
      return await this.prismaService.accessPolicy.delete({ where: { id } });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2025') {
        throw new HttpException('Access policy not found', HttpStatus.NOT_FOUND);
      }
      throw new HttpException('Failed to delete access policy', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
}