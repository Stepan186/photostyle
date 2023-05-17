import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import {
    ArrayMinSizeI18n,
    IsArrayI18n,
    IsBooleanI18n,
    IsIntI18n,
    IsNumberI18n,
    IsStringI18n,
    MinLengthI18n,
} from '@1creator/backend';
import { PlainObject } from '@mikro-orm/core';

export class AlbumPageRegionDetailsDto {
    @IsNumberI18n()
    x: number;

    @IsNumberI18n()
    y: number;

    @IsNumberI18n()
    width: number;

    @IsNumberI18n()
    height: number;

    @IsNumberI18n()
    rotation: number;
}

export class AlbumPageRegionDto extends PlainObject {
    @IsOptional()
    @IsIntI18n()
    id?: number;

    @IsOptional()
    @IsIntI18n()
    photo?: number;

    @IsOptional()
    @IsBooleanI18n()
    isProtected?: boolean;

    @IsOptional()
    @IsStringI18n()
    comment?: string;

    @Type(() => AlbumPageRegionDetailsDto)
    @ValidateNested()
    details: AlbumPageRegionDetailsDto;

    @IsOptional()
    @IsStringI18n()
    name?: string;
}

export class AlbumPageDto extends PlainObject {
    @IsOptional()
    @IsIntI18n()
    id?: number;

    @IsOptional()
    @IsNumberI18n()
    price: number;

    @IsStringI18n()
    background: string;

    @IsOptional()
    @IsStringI18n()
    comment?: string;

    @Type(() => AlbumPageRegionDto)
    @ValidateNested({ each: true })
    @IsArrayI18n()
    regions: AlbumPageRegionDto[];
}

export class StoreAlbumDto extends PlainObject {
    @IsStringI18n()
    @MinLengthI18n(1)
    name: string;

    @Type(() => AlbumPageDto)
    @ValidateNested({ each: true })
    @IsArrayI18n()
    @ArrayMinSizeI18n(1)
    pages: AlbumPageDto[];

    @IsOptional()
    @IsNumberI18n()
    price: number;

    @IsOptional()
    @IsNumberI18n()
    prepayment: number;
}
