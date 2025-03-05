import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateDoctorRequest {
  @ApiProperty({ example: 'Neurology', description: 'Updated doctor specialization', required: false })
  @IsOptional()
  @IsString()
  specialization?: string;

  @ApiProperty({ example: 'DOC456', description: 'Updated doctor license number', required: false })
  @IsOptional()
  @IsString()
  licenseNumber?: string;
}