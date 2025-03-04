import { IsDateString, IsString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'prisma/generated/main';

export class CreateAppointmentRequest {
  @IsString()
  doctorId: string;

  @IsString()
  patientId: string;

  @IsDateString()
  scheduledAt: string;

  @IsDateString()
  endTime: string;

  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @IsString()
  @IsOptional()
  type?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  location?: string;
}