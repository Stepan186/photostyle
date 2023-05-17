import { IsNumberI18n, IsStringI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class StoreOrderPhotoDto {
    @IsOptional()
    @IsStringI18n()
    order: string;

    @IsNumberI18n()
    photo: number;

    @IsNumberI18n()
    count: number;

    @IsNumberI18n()
    priceItem: number;
}