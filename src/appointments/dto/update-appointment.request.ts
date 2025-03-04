import { IsDateString, IsString, IsEnum, IsOptional, IsBoolean } from 'class-validator';
import { AppointmentStatus } from 'prisma/generated/main';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentRequest {
  @ApiProperty({ example: '2025-03-15T11:00:00Z', description: 'Updated scheduled start time', required: false })
  @IsDateString()
  @IsOptional()
  scheduledAt?: string;

  @ApiProperty({ example: '2025-03-15T11:30:00Z', description: 'Updated scheduled end time', required: false })
  @IsDateString()
  @IsOptional()
  endTime?: string;

  @ApiProperty({ enum: AppointmentStatus, example: 'COMPLETED', description: 'Updated appointment status', required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiProperty({ example: 'Follow-up', description: 'Updated type of appointment', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'Patient feeling better', description: 'Updated notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'LA Clinic', description: 'Updated location', required: false })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiProperty({ example: true, description: 'Whether a reminder was sent', required: false })
  @IsOptional()
  @IsBoolean()
  reminderSent?: boolean;
}