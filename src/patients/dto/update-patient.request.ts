import { IsDateString, IsOptional, IsString } from 'class-validator';

export class UpdatePatientRequest {
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  emergencyContact?: string;
}