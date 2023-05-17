import { BaseEntity, Entity, ManyToOne, Property } from '@mikro-orm/core';
import { AlbumPage } from '../../albums/entities/album-page.entity';
import { AlbumComposition } from './album-composition.entity';

@Entity()
export class AlbumCompositionPage extends BaseEntity<AlbumCompositionPage, 'composition' | 'page'> {
    @ManyToOne(() => AlbumComposition, { primary: true, onDelete: 'cascade', hidden: true })
    composition: AlbumComposition;

    @ManyToOne(() => AlbumPage, { primary: true, onDelete: 'cascade' })
    page: AlbumPage;

    @Property({ nullable: true })
    comment?: string;
}
