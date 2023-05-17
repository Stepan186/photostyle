import { Body, Controller, Headers, Post, Req, Request } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration-dto';
import { ApiTags } from '@nestjs/swagger';
import { EmailVerificationService } from '../../email-utils/email-verification.service';
import { JwtService } from '../jwt/jwt.service';
import { RefreshTokenDto } from '../jwt/dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly emailVerificationService: EmailVerificationService,
        private readonly jwtService: JwtService,
    ) {
    }

    @Post('/login')
    async login(@Body() dto: LoginDto, @Req() req: Request) {
        const deviceData = await this.jwtService.generateDeviceData(req);
        return await this.authService.login(dto, deviceData);
    }

    @Post('/register')
    async register(@Body() dto: RegistrationDto, @Req() req: Request) {
        const deviceData = await this.jwtService.generateDeviceData(req);
        return await this.authService.register(dto, deviceData);
    }

    @Post('/refreshJwt')
    async refreshJwt(
        @Body() dto: RefreshTokenDto,
        @Req() req: Request,
    ) {
        const deviceData = await this.jwtService.generateDeviceData(req);
        return await this.jwtService.refreshToken(dto, deviceData);
    }

    @Post('/logout')
    async logout(@Headers('authorization') authHeader: string) {
        const token = authHeader?.split(' ')[1];
        return this.jwtService.revokeRefreshToken(token);
    }
}
