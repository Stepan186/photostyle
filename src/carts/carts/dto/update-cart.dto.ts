import { IsStringI18n, IsUuidI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class UpdateCartDto {
    @IsUuidI18n()
    uuid: string;

    @IsOptional()
    @IsStringI18n()
    comment: string;

    @IsOptional()
    @IsStringI18n()
    address: string;

    @IsOptional()
    @IsUuidI18n()
    user: string;
}