import { IsNumberI18n, IsStringI18n } from '@1creator/backend';

export class StoreOrderAlbumDto {
    @IsStringI18n()
    order: string;

    @IsNumberI18n()
    count: number = 1;

    @IsNumberI18n()
    album: number;
}