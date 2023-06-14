import { BaseNotification } from '../../../notifications/channels/base/base-notification';
import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../../notifications/channels/email/email-notification.channel';
import { User } from '../../../users/entities/user.entity';
import { createMailgen } from '../../../email-utils/helpers/create-mailgen';

export class UserRegistrationNotification extends BaseNotification implements IEmailNotification {

    user: User;

    constructor(user: User) {
        super();
        this.user = user;
    }

    via(): string[] {
        return ['mail'];
    }

    toMail(_notifiable: IMailNotifiable): IEmail {
        const email = {
            body: {
                name: this.user.fullName,
                intro: 'Регистрация прошла успешно!',
                action: {
                    instructions: 'Вы можете зайти в свой профиль:',
                    button: {
                        color: '#22BC66',
                        text: 'Перейти в профиль',
                        link: `${process.env.FRONTEND_URL}/user/me`,
                    },
                },
                greeting: '👋',
                outro: 'Письмо сгенерировано автоматически. Пожалуйста не отвечайте на него.',
                signature: 'С уважением',
            },
        };
        const html = createMailgen().generate(email);
        return { html, subject: '✅ Регистрация прошла успешно' };
    }
}