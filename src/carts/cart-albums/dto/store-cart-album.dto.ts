import { IsNumberI18n, IsUuidI18n } from '@1creator/backend';

export class StoreCartAlbumDto {
    @IsUuidI18n()
    cart: string;

    @IsNumberI18n()
    count: number = 1;

    @IsNumberI18n()
    album: number;
}