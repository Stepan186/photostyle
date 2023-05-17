import { IsIntI18n } from '@1creator/backend';

export class GetPhotoDto {
    @IsIntI18n()
    id: number;
}
