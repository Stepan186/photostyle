import { CACHE_MANAGER, HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { createValidationException } from '@1creator/backend';
import { EmailVerificationNotification } from '../auth/auth/notification/email-verification.notification';
import { NotificationsService } from '../notifications/notifications.service';
import { SendEmailVerificationCodeDto } from './dto/send-email-verification-code.dto';

@Injectable()
export class EmailVerificationService {
    constructor(
        @Inject(CACHE_MANAGER) private cache: Cache,
        private notificationsService: NotificationsService,
    ) {
    }

    async sendNotification(dto: SendEmailVerificationCodeDto) {
        const code = String(Math.floor(Math.random() * (9999 - 1000) + 1000));
        const cacheKey = this.getCacheKey(dto.email);
        await this.cache.set(cacheKey, code, { ttl: 300 });
        this.notificationsService.notify({ email: dto.email }, new EmailVerificationNotification(code));
        return 1;
    }

    async verifyCode(dto: { email: string; code?: string }) {
        if (!dto.code) {
            await this.sendNotification(dto);
            throw new HttpException({
                name: 'EmailVerificationRequired',
                message: 'Код подтверждения отправлен на почту',
            }, HttpStatus.BAD_REQUEST);
        }

        const cacheKey = this.getCacheKey(dto.email);
        const code = await this.cache.get(cacheKey);
        if (code !== dto.code) {
            throw createValidationException({ emailVerificationCode: ['Неверный код подтверждения'] });
        }
        return 1;
    }

    getCacheKey(email: string): string {
        return `email-verification.${email}.code`;
    }
}
