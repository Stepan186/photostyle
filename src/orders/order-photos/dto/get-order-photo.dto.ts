import { IsNumberI18n, IsStringI18n } from '@1creator/backend';

export class GetOrderPhotoDto {
    @IsStringI18n()
    order: string;

    @IsNumberI18n()
    priceItem: number;

    @IsNumberI18n()
    photo: number;
}