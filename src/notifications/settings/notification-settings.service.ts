import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { NotificationSettings } from './entities/notification-settings.entity';
import { User } from '../../users/entities/user.entity';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';

@Injectable()
export class NotificationSettingsService {
    constructor(
        @InjectRepository(NotificationSettings)
        private repository: EntityRepository<NotificationSettings>,
    ) {
    }

    async getSettings(user: User) {
        let res = await this.repository.findOne({ user });
        if (!res) {
            res = this.repository.create({ user, email: true });
        }
        return res;
    }

    async updateSettings(user: User, dto: UpdateNotificationSettingsDto) {
        let res = await this.repository.findOne({ user });
        if (!res) {
            res = this.repository.create({ user, email: true });
        }
        res.assign(dto);
        await this.repository.getEntityManager().flush();
        return res;
    }
}



// async filterUsersByEmailAllow(users: User[]) {
//     await this.usersRepository.populate(users, ['notificationSettings'], { refresh: true });
//     return users.filter(u => u.notificationSettings ? u.notificationSettings.email : true);
// }
