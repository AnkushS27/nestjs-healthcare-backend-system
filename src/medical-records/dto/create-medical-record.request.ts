import { IsString, IsArray, IsOptional } from 'class-validator';

export class CreateMedicalRecordRequest {
  @IsString()
  patientId: string;

  @IsString()
  diagnosis: string;

  @IsString()
  treatment: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}