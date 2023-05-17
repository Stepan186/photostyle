import {
    BaseEntity,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Album } from './album.entity';
import { Upload } from '../../../uploads/entities/upload.entity';
import { AlbumPageRegion } from './album-page-region.entity';

@Entity()
export class AlbumPage extends BaseEntity<AlbumPage, 'id'> {
    [OptionalProps]: 'createdAt' | 'updatedAt' | 'album';

    @PrimaryKey()
    id: number;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    price: number;

    @Property({ nullable: true })
    comment?: string;

    @ManyToOne(() => Album, { hidden: true, onDelete: 'cascade' })
    album: Album;

    @OneToMany(() => AlbumPageRegion, 'page', { orphanRemoval: true })
    regions = new Collection<AlbumPageRegion>(this);

    @ManyToOne(() => Upload)
    background: Upload;

    @Property({ default: 0 })
    ordering: number;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

}
