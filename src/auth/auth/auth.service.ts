import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { RegistrationDto } from './dto/registration-dto';
import { UsersService } from '../../users/users.service';
import { CryptoService } from './crypto.service';
import { IDeviceDataMeta } from '../jwt/interfaces/device-data.interface';
import { ILoginResponse } from '../jwt/interfaces/login-response.interface';
import { JwtService } from '../jwt/jwt.service';
import { createValidationException } from '@1creator/backend';
import { User } from '../../users/entities/user.entity';
import { Agent } from '../../agents/agents/entities/agent.entity';
import { ISocialAuthUser } from '../social/types/social-auth-user.interface';
import { EmailVerificationService } from '../../email-utils/email-verification.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { UserRegistrationNotification } from './notification/user-registration.notification';
import { AgentRegistrationNotification } from './notification/agent-registration.notification';
import { ProfileService } from "../../users/profile.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly profileService: ProfileService,
        private readonly passwordService: CryptoService,
        private readonly emailVerificationService: EmailVerificationService,
        private readonly jwtService: JwtService,
        private notificationService: NotificationsService,
    ) {
    }

    async login(dto: LoginDto, deviceData: IDeviceDataMeta): Promise<ILoginResponse> {
        let user: User;
        try {
            user = await this.profileService.get({ email: dto.email });
            await this.passwordService.compareBcrypt(dto.password, user.password!);
        } catch (e) {
            throw createValidationException({ password: ['Неверный пароль'] });
        }

        const tokens = await this.jwtService.createTokens(deviceData, user);
        return { tokens, user };
    }

    async register(dto: RegistrationDto, deviceData: IDeviceDataMeta): Promise<ILoginResponse> {
        if (
            await this.usersService.isExists({ email: dto.email })
        ) {
            throw createValidationException({ email: ['Пользователь с такой электронной почтой уже существует'] });
        }
        await this.emailVerificationService.verifyCode({
            code: dto.emailVerificationCode,
            email: dto.email,
        });

        const user = await this.usersService.store(dto);

        if (dto.isAgent) {
            this.notificationService.notify(user, new AgentRegistrationNotification(user));
        } else {
            this.notificationService.notify(user, new UserRegistrationNotification(user));
        }

        const tokens = await this.jwtService.createTokens(deviceData, user);
        return { tokens, user };
    }

    async registerWithSocialAuth(dto: ISocialAuthUser, deviceData: IDeviceDataMeta): Promise<ILoginResponse> {
        const [user, _created] = await this.usersService.getOrCreate({ email: dto.email }, { ...dto });

        const tokens = await this.jwtService.createTokens(deviceData, user);

        return { tokens, user };
    }
}
