import { Album } from './entities/album.entity';
import { Assignable } from '@1creator/common';
import { AlbumComposition } from '../compositions/entities/album-composition.entity';

export class AlbumCompositionCompleteEvent extends Assignable {
    composition: AlbumComposition;
}

export class AlbumCompleteEvent extends Assignable {
    album: Album;
}