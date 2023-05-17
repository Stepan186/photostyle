import { Global, Module } from '@nestjs/common';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { CryptoService } from './auth/crypto.service';
import { UsersModule } from '../users/users.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailUtilsModule } from '../email-utils/email-utils.module';
import { RefreshTokenMeta } from './jwt/entities/refresh-token-meta.entity';
import { User } from '../users/entities/user.entity';
import { JwtService } from './jwt/jwt.service';
import { ProfileController } from '../users/profile.controller';
import { PhoneUtilsModule } from '../phone-utils/phone-utils.module';
import { SocialAuthController } from './social/social-auth.controller';
import { YandexAuthService } from './social/yandex-auth.service';
import { VkAuthService } from './social/vk-auth.service';
import { OkAuthService } from './social/ok-auth.service';
import { SocialAuthService } from './social/social-auth.service';

@Global()
@Module({
    imports: [
        MikroOrmModule.forFeature([User, RefreshTokenMeta]),
        UsersModule,
        EmailUtilsModule,
        PhoneUtilsModule,
    ],
    controllers: [AuthController, ProfileController, SocialAuthController],
    providers: [
        AuthService,
        CryptoService,
        JwtService,
        SocialAuthService,
        YandexAuthService,
        VkAuthService,
        OkAuthService,
    ],
    exports: [AuthService, CryptoService, JwtService],
})
export class AuthModule {
}
