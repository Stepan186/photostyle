import { BaseNotification } from '../../../notifications/channels/base/base-notification';
import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../../notifications/channels/email/email-notification.channel';
import { createMailgen } from '../../../email-utils/create-mailgen';
import * as process from 'process';

export class EmailVerificationNotification extends BaseNotification implements IEmailNotification {
    private readonly code: string;

    constructor(code: string) {
        super();
        this.code = code;
    }

    toMail(_notifiable: IMailNotifiable): IEmail {
        const html = createMailgen().generate({
            body: {
                greeting: '👋 Добрый день',
                intro: `Ваш код подтверждения для регистрации на сайте ${process.env.APP_NAME}: <b>${this.code}</b>.`,
                outro: 'Письмо сгенерировано автоматически. Пожалуйста не отвечайте на него.',
                signature: 'С уважением',
            },
        });
        return { html, subject: 'Ваш код подтверждения' };
    }

    via(): string[] {
        return ['mail'];
    }
}