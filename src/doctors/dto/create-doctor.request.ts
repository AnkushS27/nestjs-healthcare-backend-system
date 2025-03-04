import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateDoctorRequest {
  @ApiProperty({ example: 'Cardiology', description: 'Doctor specialization' })
  @IsString()
  specialization: string;

  @ApiProperty({ example: 'DOC123', description: 'Doctor license number' })
  @IsString()
  licenseNumber: string;
}