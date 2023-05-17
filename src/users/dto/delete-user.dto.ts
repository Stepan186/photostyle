import { IsIntI18n } from '@1creator/backend';

export class DeleteUserDto {
    @IsIntI18n()
    uuid: string;
}
