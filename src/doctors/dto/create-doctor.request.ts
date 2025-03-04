import { IsString, IsOptional } from 'class-validator';

export class CreateDoctorRequest {
  @IsString()
  specialization: string;

  @IsString()
  licenseNumber: string;
}