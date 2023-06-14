import { IsStringI18n, MaxLengthI18n, MinLengthI18n } from '@1creator/backend';
import { IsOptional } from "class-validator";
import { PlainObject } from "@mikro-orm/core";

export class GetUserDto extends PlainObject {
    @IsOptional()
    @IsStringI18n()
    @MaxLengthI18n(100)
    uuid?: string;

    @IsOptional()
    @IsStringI18n()
    @MaxLengthI18n(100)
    email?: string;

    @IsOptional()
    @IsStringI18n()
    @MinLengthI18n(8)
    @MaxLengthI18n(100)
    phone?: string;
}
