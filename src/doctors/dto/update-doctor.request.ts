import { IsString, IsOptional } from 'class-validator';

export class UpdateDoctorRequest {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;
}