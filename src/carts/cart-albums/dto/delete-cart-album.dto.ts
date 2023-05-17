import { IsNumberI18n, IsUuidI18n } from '@1creator/backend';

export class DeleteCartAlbumDto {
    @IsUuidI18n()
    cart: string;

    @IsNumberI18n()
    id: number;
}