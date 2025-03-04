import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicalRecordRequest {
  @ApiProperty({ example: 'patient-uuid', description: 'ID of the patient' })
  @IsString()
  patientId: string;

  @ApiProperty({ example: 'Hypertension', description: 'Diagnosis' })
  @IsString()
  diagnosis: string;

  @ApiProperty({ example: 'Prescribed medication', description: 'Treatment plan' })
  @IsString()
  treatment: string;

  @ApiProperty({ example: 'Follow up in 2 weeks', description: 'Additional notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: ['http://example.com/report.pdf'], description: 'URLs to attachments', required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}