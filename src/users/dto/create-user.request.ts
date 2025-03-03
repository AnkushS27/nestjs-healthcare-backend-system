import { IsEmail, IsStrongPassword, IsOptional, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsStrongPassword()
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;

  @IsOptional()
  adminData?: { department: string };

  @IsOptional()
  doctorData?: { specialization: string; licenseNumber: string };

  @IsOptional()
  patientData?: { dateOfBirth: Date; emergencyContact?: string };
}