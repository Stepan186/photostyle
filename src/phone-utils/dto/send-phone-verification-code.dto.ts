import { IsInI18n, IsStringI18n } from '@1creator/backend';

export enum PhoneVerificationChannel {
    Call = 'call',
    Sms = 'sms'
}

export class SendPhoneVerificationCodeDto {
    @IsStringI18n()
    phone: string;

    @IsInI18n(Object.values(PhoneVerificationChannel))
    channel: PhoneVerificationChannel;
}