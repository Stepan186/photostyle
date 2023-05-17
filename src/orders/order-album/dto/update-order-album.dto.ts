import { IsNumberI18n } from '@1creator/backend';
import { AlbumComposition } from '../../../albums/compositions/entities/album-composition.entity';

export class UpdateOrderAlbumDto {
    @IsNumberI18n()
    id: number;

    @IsNumberI18n()
    count: number;

    composition: AlbumComposition;
}