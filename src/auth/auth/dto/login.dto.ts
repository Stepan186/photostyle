import { IsEmailI18n, IsStringI18n } from '@1creator/backend';

export class LoginDto {
    @IsStringI18n()
    @IsEmailI18n()
    email: string;

    @IsStringI18n()
    password: string;
}
