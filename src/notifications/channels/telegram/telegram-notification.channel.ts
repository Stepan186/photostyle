import { Injectable } from '@nestjs/common';
import { BaseNotificationChannel } from '../base/base-notification.channel';
import { BaseNotification } from '../base/base-notification';


@Injectable()
export class TelegramNotificationChannel extends BaseNotificationChannel {
    notify(notifiable: any, notification: BaseNotification) {
    }
}