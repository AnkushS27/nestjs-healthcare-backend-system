import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordRequest } from './dto/create-medical-record.request';
import { UpdateMedicalRecordRequest } from './dto/update-medical-record.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('medical-records')
@ApiBearerAuth('JWT-auth')
@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create a medical record (Admin/Doctor only)' })
  @ApiBody({ type: CreateMedicalRecordRequest })
  @ApiResponse({ status: 201, description: 'Medical record created' })
  @ApiResponse({ status: 403, description: 'Forbidden (role-based)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createMedicalRecord(@Body() data: CreateMedicalRecordRequest) {
    return this.medicalRecordsService.createMedicalRecord(data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Get medical record by ID' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  @ApiResponse({ status: 200, description: 'Medical record details' })
  @ApiResponse({ status: 403, description: 'Forbidden (role-based)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMedicalRecord(@Param('id') id: string) {
    return this.medicalRecordsService.getMedicalRecordById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Update medical record (Admin/Doctor only)' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  @ApiBody({ type: UpdateMedicalRecordRequest })
  @ApiResponse({ status: 200, description: 'Medical record updated' })
  @ApiResponse({ status: 403, description: 'Forbidden (role-based)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  updateMedicalRecord(@Param('id') id: string, @Body() data: UpdateMedicalRecordRequest) {
    return this.medicalRecordsService.updateMedicalRecord(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete medical record (Admin only)' })
  @ApiParam({ name: 'id', description: 'Medical record ID' })
  @ApiResponse({ status: 200, description: 'Medical record deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  deleteMedicalRecord(@Param('id') id: string) {
    return this.medicalRecordsService.deleteMedicalRecord(id);
  }
}