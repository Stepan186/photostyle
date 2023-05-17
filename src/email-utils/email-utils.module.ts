import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailVerificationService } from './email-verification.service';

@Module({
    imports: [],
    controllers: [],
    providers: [EmailService, EmailVerificationService],
    exports: [EmailService, EmailVerificationService],
})
export class EmailUtilsModule {
}
