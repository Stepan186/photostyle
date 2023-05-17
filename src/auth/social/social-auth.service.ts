import { Injectable, NotFoundException, Request } from '@nestjs/common';
import { ISocialAuthService } from './types/social-auth-service.interface';
import { JwtService } from '../jwt/jwt.service';
import { AuthService } from '../auth/auth.service';
import { YandexAuthService } from './yandex-auth.service';
import { VkAuthService } from './vk-auth.service';
import { OkAuthService } from './ok-auth.service';

@Injectable()
export class SocialAuthService {
    private readonly services: Record<string, ISocialAuthService>;

    constructor(
        private readonly jwtService: JwtService,
        private readonly authService: AuthService,
        private readonly yandexAuthService: YandexAuthService,
        private readonly vkAuthService: VkAuthService,
        private readonly okAuthService: OkAuthService,
    ) {
        this.services = {
            yandex: yandexAuthService,
            vk: vkAuthService,
            ok: okAuthService,
        };
    }

    async redirect(provider: string) {
        if (!this.services[provider]) {
            throw new NotFoundException();
        }
        return this.services[provider].redirect();
    }

    async callback(provider: string, query: Record<string, string>, req: Request) {
        if (!this.services[provider]) {
            throw new NotFoundException();
        }
        try {
            const info = await this.services[provider].callback(query);
            const deviceData = await this.jwtService.generateDeviceData(req);
            const { tokens } = await this.authService.registerWithSocialAuth(info, deviceData);
            return {
                url: process.env.FRONTEND_URL + '?token=' + tokens.refreshToken,
                statusCode: 307,
            };
        } catch (e) {
            console.log(e);
            return {
                url: process.env.FRONTEND_URL,
                statusCode: 307,
            };
        }
    }
}
