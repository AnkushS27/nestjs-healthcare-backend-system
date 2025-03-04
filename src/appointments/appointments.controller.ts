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
import { AuditAction as AuditActionEnum } from 'prisma/generated/logs';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard, AbacGuard)
@UseInterceptors(AuditLoggingInterceptor)
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  @AuditActionDecorator(AuditActionEnum.CREATE)
  createAppointment(@Body() data: CreateAppointmentRequest) {
    return this.appointmentsService.createAppointment(data);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.PATIENT)
  getAppointment(@Param('id') id: string) {
    return this.appointmentsService.getAppointmentById(id);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN, UserRole.DOCTOR)
  updateAppointment(@Param('id') id: string, @Body() data: UpdateAppointmentRequest) {
    return this.appointmentsService.updateAppointment(id, data);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  deleteAppointment(@Param('id') id: string) {
    return this.appointmentsService.deleteAppointment(id);
  }
}