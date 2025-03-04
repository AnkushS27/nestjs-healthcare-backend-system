import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientRequest } from './dto/create-patient.request';
import { UpdatePatientRequest } from './dto/update-patient.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('patients')
@ApiBearerAuth('JWT-auth')
@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post(':userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a patient profile (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID to link patient profile' })
  @ApiBody({ type: CreatePatientRequest })
  @ApiResponse({ status: 201, description: 'Patient created' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createPatient(@Param('userId') userId: string, @Body() data: CreatePatientRequest) {
    return this.patientsService.createPatient(userId, data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Get patient by ID' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient details' })
  @ApiResponse({ status: 403, description: 'Forbidden (role-based)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getPatient(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  @ApiOperation({ summary: 'Update patient profile (Admin/Patient only)' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiBody({ type: UpdatePatientRequest })
  @ApiResponse({ status: 200, description: 'Patient updated' })
  @ApiResponse({ status: 403, description: 'Forbidden (role-based)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updatePatient(@Param('id') id: string, @Body() data: UpdatePatientRequest) {
    return this.patientsService.updatePatient(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete patient profile (Admin only)' })
  @ApiParam({ name: 'id', description: 'Patient ID' })
  @ApiResponse({ status: 200, description: 'Patient deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deletePatient(@Param('id') id: string) {
    return this.patientsService.deletePatient(id);
  }
}