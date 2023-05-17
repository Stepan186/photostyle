import * as process from 'process';
import { createTransport, Transporter } from 'nodemailer';

export class EmailService {
    transport: Transporter;

    constructor() {
        this.transport = createTransport({
            host: process.env.MAIL_HOST,
            port: +process.env.MAIL_PORT!,
            secure: process.env.MAIL_ENCRYPTION === 'SSL',
            auth: {
                user: process.env.MAIL_USERNAME,
                pass: process.env.MAIL_PASSWORD,
            },
        });
    }

    async send(opts: {
        to: string | string[],
        html: string,
        subject: string
    }) {
        await this.transport.sendMail({
            from: process.env.MAIL_FROM,
            ...opts,
        });
    }
}
