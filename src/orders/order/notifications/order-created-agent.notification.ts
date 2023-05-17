import { BaseNotification } from '../../../notifications/channels/base/base-notification';
import { Order } from '../entities/order.entity';
import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../../notifications/channels/email/email-notification.channel';
import { createMailgen } from '../../../email-utils/create-mailgen';

export class OrderCreatedAgentNotification extends BaseNotification implements IEmailNotification {
    order: Order;

    constructor(order: Order) {
        super();
        this.order = order;
    }

    public via(): string[] {
        return ['mail', 'telegram'];
    }

    public toMail(_notifiable: IMailNotifiable): IEmail {
        const email = {
            body: {
                name: this.order.user.fullName,
                intro: 'Новый заказ!',
                action: {
                    instructions: 'Вы можете посмотреть новый заказ на странице заказа:',
                    button: {
                        color: '#22BC66',
                        text: 'Перейти к заказу',
                        link: `${process.env.FRONTEND_URL}/agent/orders-${this.order.uuid}`,
                    },
                },
                greeting: '👋',
                outro: 'Письмо сгенерировано автоматически. Пожалуйста не отвечайте на него.',
                signature: 'С уважением',
            },
        };
        const html = createMailgen().generate(email);
        return { html, subject: '✅ Создан новый заказ' };
    }

    public toTelegram(_notifiable: any): string {
        return `Уважаемый ${this.order.user.fullName}, ваш заказ №${this.order.id} создан!`;
    }
}