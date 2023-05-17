import { IsIntI18n } from '@1creator/backend';

export class GetAlbumCompositionDto {
    @IsIntI18n()
    id: number;
}