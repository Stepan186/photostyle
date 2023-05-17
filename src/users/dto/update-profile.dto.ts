import { IsOptional, IsUUID, MinLength, ValidateIf, ValidateNested } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsSame, IsStringI18n, LengthI18n } from '@1creator/backend';
import { PlainObject } from "@mikro-orm/core";

export class AgentDto extends PlainObject {
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
}

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
    @Type(() => AgentDto)
    @ValidateNested()
    agent: AgentDto;

    @IsOptional()
    @MinLength(6, { message: 'Длина пароля должна быть не менее 6 символов.' })
    @IsStringI18n()
    password: string;

    @ValidateIf(o => o.password)
    @IsSame('password', { message: 'Подтверждение пароля введено неверно.' })
    @IsStringI18n()
    passwordConfirmation: string;
}
