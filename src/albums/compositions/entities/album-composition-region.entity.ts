import { BaseEntity, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Photo } from '../../../photos/entities/photo.entity';
import { AlbumComposition } from './album-composition.entity';
import { AlbumPageRegion } from '../../albums/entities/album-page-region.entity';

@Entity()
export class AlbumCompositionRegion extends BaseEntity<AlbumCompositionRegion, 'composition' | 'region'> {
    @ManyToOne(() => AlbumComposition, { primary: true, onDelete: 'cascade', hidden: true })
    composition: AlbumComposition;

    @ManyToOne(() => AlbumPageRegion, { primary: true, onDelete: 'cascade' })
    region: AlbumPageRegion;

    @ManyToOne(() => Photo, { onDelete: 'cascade' })
    photo: Photo;

    @Property({ nullable: true })
    comment?: string;

}
