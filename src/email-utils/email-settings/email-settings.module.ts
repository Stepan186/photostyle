import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { EmailSetting } from './entitites/email-setting.entity';
import { EmailSettingsController } from './email-settings.controller';
import { EmailSettingsService } from './email-settings.service';

@Module({
    imports: [MikroOrmModule.forFeature([EmailSetting])],
    controllers: [EmailSettingsController],
    providers: [EmailSettingsService],
    exports: [],
})

export class EmailSettingsModule {
}