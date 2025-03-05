import { IsString, IsArray, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateMedicalRecordRequest {
  @ApiProperty({ example: 'Diabetes', description: 'Updated diagnosis', required: false })
  @IsString()
  @IsOptional()
  diagnosis?: string;

  @ApiProperty({ example: 'Adjusted medication', description: 'Updated treatment plan', required: false })
  @IsString()
  @IsOptional()
  treatment?: string;

  @ApiProperty({ example: 'Follow up extended', description: 'Updated notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiProperty({ example: ['http://example.com/new-report.pdf'], description: 'Updated URLs to attachments', required: false })
  @IsArray()
  @IsOptional()
  attachments?: string[];
}