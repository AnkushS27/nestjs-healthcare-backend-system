import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { AccessPoliciesService } from './access-policies.service';
import { CreateAccessPolicyRequest } from './dto/create-access-policy.request';
import { UpdateAccessPolicyRequest } from './dto/update-access-policy.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Controller('access-policies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessPoliciesController {
  constructor(private readonly accessPoliciesService: AccessPoliciesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  createAccessPolicy(@Body() data: CreateAccessPolicyRequest) {
    return this.accessPoliciesService.createAccessPolicy(data);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  getAllAccessPolicies() {
    return this.accessPoliciesService.getAllAccessPolicies();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  getAccessPolicy(@Param('id') id: string) {
    return this.accessPoliciesService.getAccessPolicyById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  updateAccessPolicy(@Param('id') id: string, @Body() data: UpdateAccessPolicyRequest) {
    return this.accessPoliciesService.updateAccessPolicy(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteAccessPolicy(@Param('id') id: string) {
    return this.accessPoliciesService.deleteAccessPolicy(id);
  }
}