import { CACHE_MANAGER, HttpException, Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { ZvonokService } from './zvonok.service';
import { SmscService } from './smsc.service';
import { HttpService } from '@nestjs/axios';
import { PhoneVerificationChannel, SendPhoneVerificationCodeDto } from './dto/send-phone-verification-code.dto';
import { createValidationException } from '@1creator/backend';

@Injectable()
export class PhoneVerificationService {
    constructor(
        private httpService: HttpService,
        private smscService: SmscService,
        private zvonokService: ZvonokService,
        @Inject(CACHE_MANAGER)
        private cache: Cache,
    ) {
    }

    getCacheKey(phone: string): string {
        return `auth.${phone}.phoneCode`;
    }

    async sendCode(dto: SendPhoneVerificationCodeDto) {
        let code;

        if (process.env.DEBUG) {
            const testCode = 9999;
            await this.cache.set(this.getCacheKey(dto.phone), testCode, { ttl: 300 });
            return testCode;
        } else {
            code = Math.ceil(Math.random() * (9999 - 1000) + 1000);
        }

        switch (dto.channel) {
            case PhoneVerificationChannel.Call: {
                const text = `Ваш код подтверждения: <break time="200ms"/>${String(code)
                    .split('')
                    .join('<break time="200ms"/>')}`;
                await this.zvonokService.call(dto.phone, text);
                await this.cache.set(this.getCacheKey(dto.phone), code, { ttl: 300 });
                return 1;
            }
            case PhoneVerificationChannel.Sms:
                await this.smscService.sendSms(
                    dto.phone,
                    `Код подтверждения: ${code}`,
                );
                await this.cache.set(this.getCacheKey(dto.phone), code, { ttl: 300 });
                return 1;
        }
    }

    async verifyCode(dto: { phone: string, code?: string }) {
        if (!dto.code) {
            await this.sendCode({ phone: dto.phone, channel: PhoneVerificationChannel.Call });
            throw new HttpException({
                name: 'PhoneVerificationRequired',
                message: 'Необходимо подтверждение телефона',
            }, 400);
        }

        const cacheKey = this.getCacheKey(dto.phone);
        const cachedCode = await this.cache.get(cacheKey);
        if (!cachedCode || cachedCode != dto.code) {
            throw createValidationException({ phoneVerificationCode: ['Код подтверждения введён неверно'] });
        }
        await this.cache.del(cacheKey);
        return 1;
    }
}
