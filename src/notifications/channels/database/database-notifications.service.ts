import { Injectable } from '@nestjs/common';
import { Notification } from './entities/notification.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../../users/entities/user.entity';
import { ReadNotificationsDto } from './dto/read-notifications.dto';
import { TelegramService } from '../../../telegram/telegram.service';
import { CreateNotificationDto } from './dto/create-notification.dto';
import { QueryOrder } from '@mikro-orm/core';
import { EmailService } from '../../../email-utils/email.service';

@Injectable()
export class DatabaseNotificationsService {
    constructor(
        @InjectRepository(Notification)
        private repository: EntityRepository<Notification>,
        private telegramService: TelegramService,
        private emailsService: EmailService,
    ) {
    }

    public async getMany(user: User) {
        const items = await this.repository.find(
            { $and: [{ user }] },
            { orderBy: { createdAt: QueryOrder.DESC_NULLS_LAST } },
        );
        return { items, count: items.length };
    }

    async create(data: CreateNotificationDto) {
        const notifications = data.users.map((user) => {
            return this.repository.create({
                user,
                title: data.title,
                text: data.text,
            });
        });
        await this.repository.getEntityManager().persistAndFlush(notifications);

        notifications.forEach((n) => {
            if (n.user.telegramChatId) {
                this.telegramService
                    .sendMessage(n.text, n.user.telegramChatId, n.title)
                    .catch((e) => console.log(e));
            }
        });

        // if (data.level > 0) {
        //     this.emailsService
        //         .send(
        //             data.users.map((i) => i.email).filter((i) => i),
        //             data.text,
        //             data.title,
        //         )
        //         .catch((e) => console.log(e));
        // }

        return notifications;
    }

    public async read(user: User, dto: ReadNotificationsDto) {
        await this.repository.nativeUpdate(
            {
                user,
                id: dto.notifications,
                readAt: null,
            },
            { readAt: new Date() },
        );
        return this.getMany(user);
    }
}
