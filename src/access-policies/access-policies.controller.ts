import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { AccessPoliciesService } from './access-policies.service';
import { CreateAccessPolicyRequest } from './dto/create-access-policy.request';
import { UpdateAccessPolicyRequest } from './dto/update-access-policy.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('access-policies')
@ApiBearerAuth('JWT-auth')
@Controller('access-policies')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AccessPoliciesController {
  constructor(private readonly accessPoliciesService: AccessPoliciesService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create an ABAC policy (Admin only)' })
  @ApiBody({ type: CreateAccessPolicyRequest })
  @ApiResponse({ status: 201, description: 'Policy created' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createAccessPolicy(@Body() data: CreateAccessPolicyRequest) {
    return this.accessPoliciesService.createAccessPolicy(data);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get all ABAC policies (Admin only)' })
  @ApiResponse({ status: 200, description: 'List of policies' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAllAccessPolicies() {
    return this.accessPoliciesService.getAllAccessPolicies();
  }

  @Get(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get ABAC policy by ID (Admin only)' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy details' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getAccessPolicy(@Param('id') id: string) {
    return this.accessPoliciesService.getAccessPolicyById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update ABAC policy (Admin only)' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiBody({ type: UpdateAccessPolicyRequest })
  @ApiResponse({ status: 200, description: 'Policy updated' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateAccessPolicy(@Param('id') id: string, @Body() data: UpdateAccessPolicyRequest) {
    return this.accessPoliciesService.updateAccessPolicy(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete ABAC policy (Admin only)' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Policy deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteAccessPolicy(@Param('id') id: string) {
    return this.accessPoliciesService.deleteAccessPolicy(id);
  }
}