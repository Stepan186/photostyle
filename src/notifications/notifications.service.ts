import { Injectable } from '@nestjs/common';
import { BaseNotification } from './channels/base/base-notification';
import { EmailNotificationChannel } from './channels/email/email-notification.channel';
import { TelegramNotificationChannel } from './channels/telegram/telegram-notification.channel';
import { BaseNotificationChannel } from './channels/base/base-notification.channel';


@Injectable()
export class NotificationsService {
    constructor(
        private mail: EmailNotificationChannel,
        private telegram: TelegramNotificationChannel,
    ) {
    }

    async notify(notifiable: object, notification: BaseNotification, preferredChannels?: string[]) {
        const notifiables: Array<object> = Array.isArray(notifiable) ? notifiable : [notifiable];
        const channels: string[] = preferredChannels || notification.via();

        channels.forEach((channel) => {
            notifiables.forEach(async(notifiable) => {
                const service = this[channel] as BaseNotificationChannel;
                try {
                    await service.notify(notifiable, notification);
                } catch (e) {
                    console.log(e);
                }
            });
        });
    }
}