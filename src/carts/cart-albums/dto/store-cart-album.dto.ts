import { IsArrayI18n, IsNumberI18n, IsStringI18n, IsUuidI18n } from '@1creator/backend';
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class StoreCartAlbumDto {
    @IsUuidI18n()
    cart: string;

    @IsNumberI18n()
    count: number = 1;

    @IsNumberI18n()
    album: number;

    @IsOptional()
    @Type(() => CompositionAlbumPageFieldDto)
    @IsArrayI18n()
    @ValidateNested({ each: true })
    pagesFields: CompositionAlbumPageFieldDto[];
}

export class CompositionAlbumPageFieldDto {
    @IsNumberI18n()
    page: number;

    @Type(() => FieldDto)
    @IsArrayI18n()
    @ValidateNested({ each: true })
    fields: FieldDto[];
}

export class FieldDto {
    @IsStringI18n()
    name: string;

    @IsStringI18n()
    value: string;
}