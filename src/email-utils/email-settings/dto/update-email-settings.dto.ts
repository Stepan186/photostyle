import { IsOptional } from 'class-validator';
import { IsStringI18n } from '@1creator/backend';

export class UpdateEmailSettingsDto {
    @IsOptional()
    @IsStringI18n()
    host: string;

    @IsOptional()
    @IsStringI18n()
    port: string;

    @IsOptional()
    @IsStringI18n()
    encryption: string;

    @IsOptional()
    @IsStringI18n()
    mailFrom: string;

    @IsOptional()
    @IsStringI18n()
    userName: string;

    @IsOptional()
    @IsStringI18n()
    password: string;
}