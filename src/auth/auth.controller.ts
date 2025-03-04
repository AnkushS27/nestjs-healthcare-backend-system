import { AuthService } from './auth.service';
import { Controller, Post, Res, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CurrentUser } from './current-user.decorator';
import { Response } from 'express';
import { User } from 'prisma/generated/main';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    @ApiOperation({ summary: 'Log in a user and set JWT cookie' })
    @ApiBody({ schema: { example: { email: 'user@example.com', password: 'password123' } } })
    @ApiResponse({ status: 201, description: 'Successful login, returns token payload' })
    @ApiResponse({ status: 401, description: 'Invalid credentials' })
    login(
        @CurrentUser() user: User, 
        @Res({ passthrough: true}) response: Response
    ) {
        return this.authService.login(user, response);
    }
}