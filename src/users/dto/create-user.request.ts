import { IsEmail, IsStrongPassword } from 'class-validator';
import { IsEnum, IsString } from 'class-validator';
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
}