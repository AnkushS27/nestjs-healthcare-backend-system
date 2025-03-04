import { IsString, IsArray, IsOptional } from 'class-validator';

export class UpdateMedicalRecordRequest {
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @IsString()
  @IsOptional()
  treatment?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];
}