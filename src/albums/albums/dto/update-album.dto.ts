import { IsIntI18n, PartialType } from '@1creator/backend';
import { StoreAlbumDto } from './store-album.dto';

export class UpdateAlbumDto extends PartialType(StoreAlbumDto) {
    @IsIntI18n()
    id: number;
}
