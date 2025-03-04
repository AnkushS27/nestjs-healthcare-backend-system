import { IsDateString, IsString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'prisma/generated/main';

export class UpdateAppointmentRequest {
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @IsDateString()
  @IsOptional()
  endTime?: string;

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