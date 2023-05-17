import { IsEmailI18n } from '@1creator/backend';

export class SendEmailVerificationCodeDto {
    @IsEmailI18n()
    email: string;
}
