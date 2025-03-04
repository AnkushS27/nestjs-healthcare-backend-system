import { Injectable } from '@nestjs/common';
import { MainPrismaService } from '../prisma/main-prisma.service';
import { CreateAccessPolicyRequest } from './dto/create-access-policy.request';
import { UpdateAccessPolicyRequest } from './dto/update-access-policy.request';

@Injectable()
export class AccessPoliciesService {
  constructor(private readonly prismaService: MainPrismaService) {}

  async createAccessPolicy(data: CreateAccessPolicyRequest) {
    return this.prismaService.accessPolicy.create({ data });
  }

  async getAccessPolicyById(id: string) {
    return this.prismaService.accessPolicy.findUnique({ where: { id } });
  }

  async getAllAccessPolicies() {
    return this.prismaService.accessPolicy.findMany();
  }

  async updateAccessPolicy(id: string, data: UpdateAccessPolicyRequest) {
    return this.prismaService.accessPolicy.update({ where: { id }, data });
  }

  async deleteAccessPolicy(id: string) {
    return this.prismaService.accessPolicy.delete({ where: { id } });
  }
}