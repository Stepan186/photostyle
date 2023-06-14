import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../../notifications/channels/email/email-notification.channel';
import { createMailgen } from '../../../email-utils/helpers/create-mailgen';
import { choice } from '@1creator/common';
import { User } from '../../../users/entities/user.entity';
import { BaseNotification } from '../../../notifications/channels/base/base-notification';

export class LowBalanceNotification extends BaseNotification implements IEmailNotification {
    user: User;
    daysLeft: number;

    constructor(user: User, daysLeft: number) {
        super();
        this.user = user;
        this.daysLeft = daysLeft;
    }

    toMail(notifiable: IMailNotifiable): IEmail {
        const daysLabel = choice(this.daysLeft, 'день', 'дня', 'дней');
        const email = {
            body: {
                name: this.user.fullName,
                intro: `Баланса вашего аккаунта хватит на ${this.daysLeft} ${daysLabel}!`,
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
        return { html, subject: '✅ Баланс скоро израсходуется' };
    }


    via(): string[] {
        return ['mail'];
    }
}