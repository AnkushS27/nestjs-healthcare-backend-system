import { Controller, Post, Body, Param, Get, Put, Delete, UseGuards, Version } from '@nestjs/common';
import { DoctorsService } from './doctors.service';
import { CreateDoctorRequest } from './dto/create-doctor.request';
import { UpdateDoctorRequest } from './dto/update-doctor.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam } from '@nestjs/swagger';

@ApiTags('doctors')
@Controller('doctors')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DoctorsController {
  constructor(private readonly doctorsService: DoctorsService) {}

  @Version('1')
  @Post(':userId')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Create a doctor profile (Admin only)' })
  @ApiParam({ name: 'userId', description: 'User ID to link doctor profile' })
  @ApiBody({ type: CreateDoctorRequest })
  @ApiResponse({ status: 201, description: 'Doctor created' })
  @ApiResponse({ status: 403, description: 'Forbidden (non-Admin)' })
  createDoctor(@Param('userId') userId: string, @Body() data: CreateDoctorRequest) {
    return this.doctorsService.createDoctor(userId, data);
  }

  @Version('1')
  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Get doctor by ID' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Doctor details' })
  getDoctor(@Param('id') id: string) {
    return this.doctorsService.getDoctorById(id);
  }

  @Version('1')
  @Put(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Update doctor profile (Admin only)' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiBody({ type: UpdateDoctorRequest })
  @ApiResponse({ status: 200, description: 'Doctor updated' })
  updateDoctor(@Param('id') id: string, @Body() data: UpdateDoctorRequest) {
    return this.doctorsService.updateDoctor(id, data);
  }

  @Version('1')
  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Delete doctor profile (Admin only)' })
  @ApiParam({ name: 'id', description: 'Doctor ID' })
  @ApiResponse({ status: 200, description: 'Doctor deleted' })
  deleteDoctor(@Param('id') id: string) {
    return this.doctorsService.deleteDoctor(id);
  }

  @Version('1')
  @Post(':doctorId/follow-ups')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @ApiOperation({ summary: 'Create a follow-up reminder (Admin/Doctor only, requires Authentication cookie, v1)' })
  @ApiParam({ name: 'doctorId', description: 'Doctor ID' })
  @ApiBody({ schema: { example: { patientName: 'John Doe', patientId: '<patient-id>', dueDate: '2025-03-10T00:00:00Z', description: 'Check-up' } } })
  @ApiResponse({ status: 201, description: 'Follow-up reminder created' })
  @ApiResponse({ status: 403, description: 'Forbidden (role-based)' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  createFollowUpReminder(@Param('doctorId') doctorId: string, @Body() data: any) {
    return this.doctorsService.createFollowUpReminder(doctorId, data);
  }
}