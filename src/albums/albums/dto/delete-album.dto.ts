import { IsIntI18n } from '@1creator/backend';

export class DeleteAlbumDto {
    @IsIntI18n()
    id: number;
}
