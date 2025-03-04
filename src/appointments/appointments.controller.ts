import { Controller, Post, Body, Get, Put, Delete, Param, UseGuards, UseInterceptors } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { CreateAppointmentRequest } from './dto/create-appointment.request';
import { UpdateAppointmentRequest } from './dto/update-appointment.request';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from 'src/users/enums/user-role.enum';
import { AbacGuard } from 'src/auth/guards/abac.guard';
import { AuditActionDecorator } from '../logging/decorators/audit-log.decorator';
import { AuditLoggingInterceptor } from '../logging/interceptors/audit-logging.interceptor';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiParam, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('appointments')
@ApiBearerAuth('JWT-auth')
@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, AbacGuard)
@UseInterceptors(AuditLoggingInterceptor)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @AuditActionDecorator('CREATE')
  @ApiOperation({ summary: 'Create an appointment (Admin/Doctor only)' })
  @ApiBody({ type: CreateAppointmentRequest })
  @ApiResponse({ status: 201, description: 'Appointment created' })
  @ApiResponse({ status: 403, description: 'Forbidden (time/location restriction or role)' })
  createAppointment(@Body() data: CreateAppointmentRequest) {
    return this.appointmentsService.createAppointment(data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  @ApiOperation({ summary: 'Get appointment by ID' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment details' })
  getAppointment(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @AuditActionDecorator('UPDATE')
  @ApiOperation({ summary: 'Update appointment (Admin/Doctor only)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiBody({ type: UpdateAppointmentRequest })
  @ApiResponse({ status: 200, description: 'Appointment updated' })
  updateAppointment(@Param('id') id: string, @Body() data: UpdateAppointmentRequest) {
    return this.appointmentsService.updateAppointment(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @AuditActionDecorator('DELETE')
  @ApiOperation({ summary: 'Delete appointment (Admin only)' })
  @ApiParam({ name: 'id', description: 'Appointment ID' })
  @ApiResponse({ status: 200, description: 'Appointment deleted' })
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointment(id);
  }
}