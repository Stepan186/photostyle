import { IsOptional } from 'class-validator';
import { IsStringI18n, IsUuidI18n } from '@1creator/backend';
import { PlainObject } from "@mikro-orm/core";

export class UpdateAgentDto extends PlainObject {
    @IsOptional()
    @IsStringI18n()
    name?: string;

    @IsOptional()
    @IsStringI18n()
    mailAddress?: string;

    @IsOptional()
    @IsStringI18n()
    legalAddress?: string;

    @IsOptional()
    @IsStringI18n()
    email?: string;

    @IsOptional()
    @IsStringI18n()
    bik?: string;

    @IsOptional()
    @IsStringI18n()
    ogrn?: string;

    @IsOptional()
    @IsStringI18n()
    director?: string;

    @IsOptional()
    @IsStringI18n()
    inn?: string;

    @IsOptional()
    @IsStringI18n()
    kpp?: string;

    @IsOptional()
    @IsStringI18n()
    correspondentAccount?: string;

    @IsOptional()
    @IsStringI18n()
    bankAccount?: string;

    @IsOptional()
    @IsUuidI18n()
    watermark?: string;
}
