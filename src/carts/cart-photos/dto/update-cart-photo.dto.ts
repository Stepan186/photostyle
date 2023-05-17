import { IsNumberI18n, IsUuidI18n, MinI18n } from '@1creator/backend';

export class UpdateCartPhotoDto {
    @IsUuidI18n()
    cart: string;

    @IsNumberI18n()
    photo: number;

    @IsNumberI18n()
    @MinI18n(0)
    count: number;

    @IsNumberI18n()
    priceItem: number;
}