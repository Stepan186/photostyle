import { Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../users/entities/user.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

@Injectable()
export class TelegramService {
    private readonly TELEGRAM_API = 'https://api.telegram.org/bot';
    private readonly TELEGRAM_TOKEN;

    constructor(
        private axios: HttpService,
        @InjectRepository(User) private userRepository: EntityRepository<User>,
    ) {
        this.TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
    }

    async webhook(data: any) {
        if (data.message.text === '/start') {
            await this.requestPhoneNumber(data.message.chat.id);
            return data;
        }

        if (data.message.contact) {
            let phone = data.message.contact.phone_number;
            if (phone.startsWith('+')) {
                phone = phone.substring(1);
            } else if (phone.startsWith('8')) {
                phone = '7' + phone.substring(1);
            }

            const user = await this.userRepository.findOne({ phone });
            if (!user) {
                await this.sendMessage('Пользователь не найден', data.message.chat.id);
            } else {
                user.telegramChatId = data.message.chat.id;
                await this.userRepository.getEntityManager().flush();
                await this.sendMessage(
                    `Отлично, теперь вы будете получать новые уведомления в этом чате.`,
                    data.message.chat.id,
                );
            }
        }
    }

    async sendRequest(method, data?) {
        return (
            await firstValueFrom(
                this.axios.post(
                    this.TELEGRAM_API + this.TELEGRAM_TOKEN + '/' + method,
                    data,
                ),
            )
        ).data;
    }

    async getUpdates() {
        const data = await this.sendRequest('getUpdates');
        await this.webhook(data.result[data.result.length - 1]);

        return data;
    }

    async sendMessage(body: string, chatId: string, title?: string) {
        let text = title ? `<b>${title}</b>\n` : '';
        text += body;

        return await this.sendRequest('sendMessage', {
            chat_id: chatId,
            text,
            parse_mode: 'HTML',
        });
    }

    async sendError(chatId: number) {
        return await this.sendRequest('sendMessage', {
            chat_id: chatId,
            text: 'Телефон не найден',
        });
    }

    async requestPhoneNumber(chatId: number) {
        const payload = {
            chat_id: chatId,
            text: 'Для получения уведомлений отправьте ваш номер телефона',
            reply_markup: { keyboard: [[{ text: 'Отправить номер телефона', request_contact: true }]] },
        };
        await this.sendRequest('sendMessage', payload);
    }
}
