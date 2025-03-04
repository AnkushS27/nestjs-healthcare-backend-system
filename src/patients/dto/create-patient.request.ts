import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientRequest {
  @ApiProperty({ example: '1990-01-01', description: 'Patient date of birth' })
  @IsDateString()
  dateOfBirth: string;

  @ApiProperty({ example: '123-456-7890', description: 'Emergency contact number', required: false })
  @IsOptional()
  @IsString()
  emergencyContact?: string;
}