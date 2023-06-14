import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../../notifications/channels/email/email-notification.channel';
import { createMailgen } from '../../../email-utils/helpers/create-mailgen';
import { User } from '../../../users/entities/user.entity';
import { BaseNotification } from '../../../notifications/channels/base/base-notification';

export class IsOverBalanceNotification extends BaseNotification implements IEmailNotification {
    user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    toMail(notifiable: IMailNotifiable): IEmail {
        const email = {
            body: {
                name: this.user.fullName,
                intro: `Баланс вашего аккаунта израсходован!`,
                action: {
                    instructions: 'Вы можете пополнить баланс в личном кабинете:',
                    button: {
                        color: '#22BC66',
                        text: 'Перейти в личный кабинет',
                        link: `${process.env.FRONTEND_URL}`,
                    },
                },
                greeting: '👋',
                outro: 'Письмо сгенерировано автоматически. Пожалуйста не отвечайте на него.',
                signature: 'С уважением',
            },
        };
        const html = createMailgen().generate(email);
        return { html, subject: '✅ Баланс вашего аккаунта израсходован!' };
    }

    via(): string[] {
        return ['mail'];
    }
}