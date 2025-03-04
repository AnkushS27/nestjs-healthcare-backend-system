import { IsDateString, IsOptional, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdatePatientRequest {
  @ApiProperty({ example: '1985-05-15', description: 'Updated patient date of birth', required: false })
  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @ApiProperty({ example: '987-654-3210', description: 'Updated emergency contact number', required: false })
  @IsOptional()
  @IsString()
  emergencyContact?: string;
}