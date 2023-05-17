import { IsIntI18n } from '@1creator/backend';

export class SetRegionPhotoDto {
    @IsIntI18n()
    composition: number;

    @IsIntI18n()
    region: number;

    @IsIntI18n()
    photo: number;
}