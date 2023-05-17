import { IsOptional, ValidateNested } from 'class-validator';
import {
    IsArrayI18n,
    IsBooleanI18n,
    IsDateStringI18n,
    IsIntI18n,
    IsNumberI18n,
    IsStringI18n,
    MaxI18n,
    MinI18n,
} from '@1creator/backend';
import { Type } from 'class-transformer';
import { PlainObject } from '@mikro-orm/core';

export class ProjectPriceDto extends PlainObject {
    @IsIntI18n()
    priceList: number;

    @IsOptional()
    @IsDateStringI18n()
    expiresAt: string;
}

export class StoreProjectDto {
    @IsStringI18n()
    public name: string;

    @IsStringI18n()
    publicName: string;

    @IsStringI18n()
    city: string;

    @IsOptional()
    @IsStringI18n()
    address?: string;

    @IsOptional()
    @IsDateStringI18n()
    shootingDate?: Date;

    @IsOptional()
    @IsDateStringI18n()
    saleUntil?: Date;

    @IsOptional()
    @MinI18n(0)
    @MaxI18n(100)
    @IsIntI18n()
    salePercent?: number;

    @IsOptional()
    @IsStringI18n()
    comment?: string;

    @IsOptional()
    @IsStringI18n()
    shareTemplate?: string;

    @IsOptional()
    @IsStringI18n()
    additionalInformation?: string;

    @IsOptional()
    @IsStringI18n()
    organizerName?: string;

    @IsOptional()
    @IsStringI18n()
    organizerPerson?: string;

    @IsOptional()
    @IsStringI18n()
    organizerPersonPhone?: string;

    @IsOptional()
    @IsBooleanI18n()
    hasMultipleClients?: boolean;

    @IsOptional()
    @IsBooleanI18n()
    requestClientAddress?: boolean;

    @IsOptional()
    @IsNumberI18n()
    prepayment?: number;

    @IsOptional()
    @Type(() => ProjectPriceDto)
    @ValidateNested({ each: true })
    @IsArrayI18n()
    prices?: ProjectPriceDto[];

    @IsOptional()
    @IsNumberI18n()
    group: number;
}
