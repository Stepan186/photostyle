import { IsStringI18n, MaxLengthI18n, MinLengthI18n } from '@1creator/backend';

export class GetUserDto {
    @IsStringI18n()
    @MaxLengthI18n(100)
    uuid?: string;

    @IsStringI18n()
    @MaxLengthI18n(100)
    email?: string;

    @IsStringI18n()
    @MinLengthI18n(8)
    @MaxLengthI18n(100)
    phone?: string;
}
