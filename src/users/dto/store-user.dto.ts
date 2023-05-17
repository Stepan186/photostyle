import { IsOptional } from 'class-validator';
import { IsBooleanI18n, IsStringI18n, LengthI18n } from '@1creator/backend';

export class StoreUserDto {
    @IsOptional()
    @IsStringI18n()
    firstName?: string;

    @IsOptional()
    @IsStringI18n()
    lastName?: string;

    @IsStringI18n()
    email: string;

    @IsStringI18n()
    @LengthI18n(11, 11)
    phone?: string;

    @IsStringI18n()
    password: string;

    @IsOptional()
    @IsBooleanI18n()
    isAgent?: boolean;
}
