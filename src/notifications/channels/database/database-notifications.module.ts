import { Module } from '@nestjs/common';
import { DatabaseNotificationsService } from './database-notifications.service';
import { DatabaseNotificationsController } from './database-notifications.controller';
import { AuthModule } from '../../../auth/auth.module';
import { HttpModule } from '@nestjs/axios';
import { TelegramModule } from '../../../telegram/telegram.module';
import { EmailUtilsModule } from '../../../email-utils/email-utils.module';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Notification } from './entities/notification.entity';
import { User } from '../../../users/entities/user.entity';
import { EmailService } from '../../../email-utils/email.service';

@Module({
    imports: [
        AuthModule,
        HttpModule,
        TelegramModule,
        EmailUtilsModule,
        MikroOrmModule.forFeature([Notification, User]),
    ],
    controllers: [DatabaseNotificationsController],
    providers: [
        EmailService,
        DatabaseNotificationsService,
    ],
    exports: [DatabaseNotificationsService],
})

export class DatabaseNotificationsModule {
}