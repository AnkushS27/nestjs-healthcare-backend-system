import { IsEmail, IsEnum, IsString } from 'class-validator';
import { UserRole } from '../enums/user-role.enum';

export class CreateUserRequest {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  name: string;

  @IsEnum(UserRole)
  role: UserRole;
}