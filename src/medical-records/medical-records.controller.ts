import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards } from '@nestjs/common';
import { MedicalRecordsService } from './medical-records.service';
import { CreateMedicalRecordRequest } from './dto/create-medical-record.request';
import { UpdateMedicalRecordRequest } from './dto/update-medical-record.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Controller('medical-records')
@UseGuards(JwtAuthGuard, RolesGuard)
export class MedicalRecordsController {
  constructor(private readonly medicalRecordsService: MedicalRecordsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  createMedicalRecord(@Body() data: CreateMedicalRecordRequest) {
    return this.medicalRecordsService.createMedicalRecord(data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  getMedicalRecord(@Param('id') id: string) {
    return this.medicalRecordsService.getMedicalRecordById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateMedicalRecord(@Param('id') id: string, @Body() data: UpdateMedicalRecordRequest) {
    return this.medicalRecordsService.updateMedicalRecord(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteMedicalRecord(@Param('id') id: string) {
    return this.medicalRecordsService.deleteMedicalRecord(id);
  }
}