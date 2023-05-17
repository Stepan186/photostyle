import { IsBooleanI18n, IsSame, IsStringI18n, LengthI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class RegistrationDto {
    @IsOptional()
    @IsStringI18n()
    firstName?: string;

    @IsOptional()
    @IsStringI18n()
    lastName?: string;

    @IsStringI18n()
    email: string;

    @IsOptional()
    @IsStringI18n()
    @LengthI18n(11, 11)
    phone?: string;

    @IsStringI18n()
    password: string;

    @IsSame('password')
    passwordConfirmation: string;

    @IsOptional()
    @IsStringI18n()
    emailVerificationCode?: string;

    @IsBooleanI18n()
    isAgent: boolean;
}
