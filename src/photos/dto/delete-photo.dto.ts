import { IsIntI18n } from '@1creator/backend';

export class DeletePhotoDto {
    @IsIntI18n()
    id: number;
}
