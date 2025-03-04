import { Controller, Get, Post, Body, UseInterceptors, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';import { NoFilesInterceptor } from '@nestjs/platform-express';
import { CreateUserRequest } from './dto/create-user.request';
import { User } from 'prisma/generated/main'; 
import { CurrentUser } from 'src/auth/current-user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard'; 
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { UserRole } from './enums/user-role.enum';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth('JWT-auth')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseInterceptors(NoFilesInterceptor())
  @ApiOperation({ summary: 'Create a new user (public endpoint)' })
  @ApiBody({ type: CreateUserRequest })
  @ApiResponse({ status: 201, description: 'User created', type: CreateUserRequest })
  @ApiResponse({ status: 422, description: 'Email already exists' })
  async createUser(@Body() createUserDto: CreateUserRequest) {
    return this.usersService.createUser(createUserDto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get current authenticated user' })
  @ApiResponse({ status: 200, description: 'User details', type: CreateUserRequest })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  getMe(@CurrentUser() user: User) {
    return user;
  }
}