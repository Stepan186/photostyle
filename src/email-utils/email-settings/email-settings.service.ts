import { InjectRepository } from '@mikro-orm/nestjs';
import { EmailSetting } from './entitites/email-setting.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';

export class EmailSettingsService {
    constructor(
        @InjectRepository(EmailSetting)
        private repo: EntityRepository<EmailSetting>,
    ) {
    }

    async update(dto: UpdateEmailSettingsDto) {
        const settings = await this.get();
        settings.assign(dto);
        await this.repo.getEntityManager().flush();
        return settings;
    }

    async get() {
        try {
            return await this.repo.findOneOrFail({}, { cache: 5000 });
        } catch (e) {
            return this.repo.create({
                encryption: '',
                mailFrom: '',
                password: '',
                port: '',
                userName: '',
                host: '',
            });
        }
    }
}