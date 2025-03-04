import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorRequest } from './dto/create-doctor.request';
import { UpdateDoctorRequest } from './dto/update-doctor.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';

@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Post(':userId')
  @Roles(UserRole.ADMIN)
  createDoctor(@Param('userId') userId: string, @Body() data: CreateDoctorRequest) {
    return this.doctorsService.createDoctor(userId, data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  getDoctor(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  updateDoctor(@Param('id') id: string, @Body() data: UpdateDoctorRequest) {
    return this.doctorsService.updateDoctor(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteDoctor(@Param('id') id: string) {
    return this.doctorsService.deleteDoctor(id);
  }
}