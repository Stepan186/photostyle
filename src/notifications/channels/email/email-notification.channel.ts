import { Injectable } from '@nestjs/common';
import { BaseNotificationChannel } from '../base/base-notification.channel';
import { EmailService } from '../../../email-utils/email.service';

export interface IEmail {
    subject: string;
    html: string;
}

export interface IMailNotifiable {
    email: string;
}

export interface IEmailNotification {
    toMail(notifiable: IMailNotifiable): IEmail;
}


@Injectable()
export class EmailNotificationChannel extends BaseNotificationChannel {
    constructor(private emailService: EmailService) {
        super();
    }

    async notify(notifiable: IMailNotifiable, notification: IEmailNotification) {
        const message = notification.toMail(notifiable);
        await this.emailService.send({
            to: notifiable.email,
            html: message.html,
            subject: message.subject,
        });
    }
}