import * as process from 'process';
import { createTransport } from 'nodemailer';
import { EmailSettingsService } from './email-settings/email-settings.service';

export class EmailService {
    constructor(
        private service: EmailSettingsService,
    ) {
    }

    async send(opts: {
        to: string | string[],
        html: string,
        subject: string
    }) {

        const emailSettings = await this.service.get();

        const transport = createTransport({
            host: emailSettings.host,
            port: +emailSettings.port,
            secure: emailSettings.encryption === 'SSL',
            auth: {
                user: emailSettings.userName,
                pass: emailSettings.password,
            },
        });

        await transport.sendMail({
            from: process.env.MAIL_FROM,
            ...opts,
        });
    }
}
