import { Transform } from 'class-transformer';
import { IsBooleanI18n } from '@1creator/backend';

export class UpdateNotificationSettingsDto {
    @Transform((t) => !!t.value)
    @IsBooleanI18n()
    email: boolean;
}
