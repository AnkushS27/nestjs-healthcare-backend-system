import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';
import { TokenPayload } from './token-payload.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from 'prisma/generated/main';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly configService: ConfigService,
        private readonly jwtService: JwtService,
    ) { }

    async login(user: User, response: Response) {
        const expires = new Date();
        const expirationMs = this.configService.getOrThrow<number>('JWT_EXPIRATION');
        expires.setMilliseconds(expires.getMilliseconds() + expirationMs);

        const tokenPayload: TokenPayload = {
            userId: user.id,
        };
        const token = this.jwtService.sign(tokenPayload);

        const isProduction = this.configService.get('NODE_ENV') === 'production';

        response.cookie('Authentication', token, {
            secure: isProduction,
            httpOnly: true,
            expires,
        });

        return { tokenPayload };
    }

    async verifyUser(email: string, password: string) {
        try {
            const user = await this.usersService.getUser({ email });
            const authenticated = await bcrypt.compare(password, user.password);
            if (!authenticated) {
                throw new UnauthorizedException();
            }
            return user;
        } catch (err) {
            throw new UnauthorizedException('Credentials are not valid.');
        }
    }
}