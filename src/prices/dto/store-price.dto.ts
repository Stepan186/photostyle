import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { IsArrayI18n, IsBooleanI18n, IsNumberI18n, IsStringI18n, IsUuidI18n } from '@1creator/backend';
import { PlainObject } from '@mikro-orm/core';

export class PriceItemDto extends PlainObject {
    @IsOptional()
    @IsNumberI18n()
    id: number;

    @IsNumberI18n()
    price: number;

    @IsStringI18n()
    name: string;

    @IsStringI18n()
    serviceName: string;

    @IsOptional()
    @IsArrayI18n()
    @IsUuidI18n(4, { each: true })
    examples: string[];

    @IsBooleanI18n()
    isElectronic: boolean = false;
}

export class StorePriceDto {
    @IsStringI18n()
    name: string;

    @IsOptional()
    @Type(() => PriceItemDto)
    @ValidateNested({ each: true })
    @IsArrayI18n()
    items: PriceItemDto[];
}
