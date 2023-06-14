import { BaseNotification } from '../../notifications/channels/base/base-notification';
import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../notifications/channels/email/email-notification.channel';
import { Unloading } from '../entities/unloading.entity';
import { EntityDTO } from '@mikro-orm/core';
import { createMailgen } from '../../email-utils/helpers/create-mailgen';

export class UnloadingCompletedNotification extends BaseNotification implements IEmailNotification {
    unloading: EntityDTO<Unloading>;

    constructor(unloading: EntityDTO<Unloading>) {
        super();
        this.unloading = unloading;
    }

    via(): string[] {
        return ['mail'];
    }

    toMail(_notifiable: IMailNotifiable): IEmail {
        const email = {
            body: {
                name: this.unloading.user.fullName,
                intro: 'Выгрузка готова!',
                action: {
                    instructions: 'Вы можете посмотреть доступные выгрузки на странице выгрузок.',
                    button: {
                        color: '#22BC66',
                        text: 'Перейти к выгрузкам',
                        link: `${process.env.FRONTEND_URL}/agent/unloadings`,
                    },
                },
                greeting: '👋',
                outro: 'Письмо сгенерировано автоматически. Пожалуйста не отвечайте на него.',
                signature: 'С уважением',
            },
        };
        const html = createMailgen().generate(email);
        return { html, subject: '✅ Выгрузка создана' };
    }
}