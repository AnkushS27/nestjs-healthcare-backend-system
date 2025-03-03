import { IsDateString, IsOptional, IsString } from 'class-validator';

export class CreatePatientRequest {
  @IsDateString()
  dateOfBirth: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;
}