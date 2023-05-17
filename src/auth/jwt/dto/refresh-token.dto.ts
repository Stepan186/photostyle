import { IsStringI18n } from '@1creator/backend';

export class RefreshTokenDto {
    @IsStringI18n()
    refreshToken: string;
}
