import { Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { EmailVerificationService } from './email-verification.service';
import { EmailSettingsModule } from './email-settings/email-settings.module';

@Module({
    imports: [EmailSettingsModule],
    controllers: [],
    providers: [EmailService, EmailVerificationService],
    exports: [EmailService, EmailVerificationService],
})
export class EmailUtilsModule {
}
