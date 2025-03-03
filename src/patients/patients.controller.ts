import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { PatientsService } from './patients.service';
import { CreatePatientRequest } from './dto/create-patient.request';
import { UpdatePatientRequest } from './dto/update-patient.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Controller('patients')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post(':userId')
  @Roles(UserRole.ADMIN)
  createPatient(@Param('userId') userId: string, @Body() data: CreatePatientRequest) {
    return this.patientsService.createPatient(userId, data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  getPatient(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.PATIENT)
  updatePatient(@Param('id') id: string, @Body() data: UpdatePatientRequest) {
    return this.patientsService.updatePatient(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deletePatient(@Param('id') id: string) {
    return this.patientsService.deletePatient(id);
  }
}