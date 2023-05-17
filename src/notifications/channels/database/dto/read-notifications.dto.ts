import { IsArrayI18n, IsIntI18n } from '@1creator/backend';

export class ReadNotificationsDto {
    @IsArrayI18n()
    @IsIntI18n({ each: true })
    notifications: [];
}
