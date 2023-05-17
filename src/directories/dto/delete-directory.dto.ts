import { IsIntI18n } from '@1creator/backend';

export class DeleteDirectoryDto {
    @IsIntI18n()
    id: number;
}
