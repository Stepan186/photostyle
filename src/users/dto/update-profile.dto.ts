import { IsOptional, IsUUID, MinLength, ValidateIf } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsSame, IsStringI18n, LengthI18n } from '@1creator/backend';

export class UpdateProfileDto {
    @IsOptional()
    @IsStringI18n()
    lastName?: string;

    @IsOptional()
    @IsStringI18n()
    firstName?: string;

    @IsOptional()
    @IsStringI18n()
    email?: string;

    @IsOptional()
    @LengthI18n(11, 11, { message: 'Поле должно содержать 11 символов' })
    @Transform((t) => t.value?.replace(/\D/g, '') || null)
    phone?: string;

    @IsOptional()
    @IsStringI18n()
    phoneVerificationCode?: string;

    @IsOptional()
    @IsStringI18n()
    emailVerificationCode?: string;

    @IsOptional()
    @IsUUID()
    image: string;

    @IsOptional()
    @MinLength(6, { message: 'Длина пароля должна быть не менее 6 символов.' })
    @IsStringI18n()
    password: string;

    @ValidateIf(o => o.password)
    @IsSame('password', { message: 'Подтверждение пароля введено неверно.' })
    @IsStringI18n()
    passwordConfirmation: string;
}
