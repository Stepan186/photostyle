import { IsNumberI18n } from '@1creator/backend';

export class SetAlbumRegionPhotoDto {
    @IsNumberI18n()
    album: number;

    @IsNumberI18n()
    region: number;

    @IsNumberI18n()
    photo: number;
}