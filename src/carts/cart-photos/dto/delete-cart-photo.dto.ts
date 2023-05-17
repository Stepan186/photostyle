import { IsNumberI18n, IsUuidI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class DeleteCartPhotoDto {
    @IsUuidI18n()
    cart: string;

    @IsNumberI18n()
    photo: number;

    @IsOptional()
    @IsNumberI18n()
    priceItem: number;
}