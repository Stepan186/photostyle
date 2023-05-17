import { IsNumberI18n } from '@1creator/backend';

export class DeleteOrderAlbumDto {
    @IsNumberI18n()
    id: number;
}