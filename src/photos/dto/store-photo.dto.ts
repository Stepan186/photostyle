import { IsIntI18n, IsStringI18n } from '@1creator/backend';

export class StorePhotoDto {
    @IsIntI18n()
    directory: number;

    @IsStringI18n()
    upload: string;
}
