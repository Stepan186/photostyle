import { Global, Module } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { NotificationSettings } from './settings/entities/notification-settings.entity';
import { NotificationSettingsController } from './settings/notification-settings.controller';
import { NotificationSettingsService } from './settings/notification-settings.service';
import { EmailService } from '../email-utils/email.service';
import { TelegramModule } from '../telegram/telegram.module';
import { EmailUtilsModule } from '../email-utils/email-utils.module';
import { TelegramNotificationChannel } from './channels/telegram/telegram-notification.channel';
import { EmailNotificationChannel } from './channels/email/email-notification.channel';
import { DatabaseNotificationsModule } from './channels/database/database-notifications.module';

@Global()
@Module({
    imports: [
        TelegramModule,
        EmailUtilsModule,
        DatabaseNotificationsModule,
        MikroOrmModule.forFeature([NotificationSettings]),
    ],
    controllers: [NotificationSettingsController],
    providers: [
        NotificationsService,
        NotificationSettingsService,
        EmailService,
        TelegramNotificationChannel,
        EmailNotificationChannel,
    ],
    exports: [NotificationsService],
})
export class NotificationsModule {
}
