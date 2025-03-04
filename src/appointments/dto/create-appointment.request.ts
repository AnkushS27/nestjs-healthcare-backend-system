import { IsDateString, IsString, IsEnum, IsOptional } from 'class-validator';
import { AppointmentStatus } from 'prisma/generated/main';
import { ApiProperty } from '@nestjs/swagger';

export class CreateAppointmentRequest {
  @ApiProperty({ example: 'doctor-uuid', description: 'ID of the doctor' })
  @IsString()
  doctorId: string;

  @ApiProperty({ example: 'patient-uuid', description: 'ID of the patient' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: '2025-03-15T10:00:00Z', description: 'Scheduled start time' })
  @IsDateString()
  scheduledAt: string;

  @ApiProperty({ example: '2025-03-15T10:30:00Z', description: 'Scheduled end time' })
  @IsDateString()
  endTime: string;

  @ApiProperty({ enum: AppointmentStatus, example: 'SCHEDULED', description: 'Appointment status', required: false })
  @IsEnum(AppointmentStatus)
  @IsOptional()
  status?: AppointmentStatus;

  @ApiProperty({ example: 'Regular Checkup', description: 'Type of appointment', required: false })
  @IsString()
  @IsOptional()
  type?: string;

  @ApiProperty({ example: 'Check blood pressure', description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: 'NY Clinic', description: 'Location of appointment', required: false })
  @IsString()
  @IsOptional()
  location?: string;
}