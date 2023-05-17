import {
    BaseEntity,
    Embeddable,
    Embedded,
    Entity,
    ManyToOne,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { AlbumPage } from './album-page.entity';
import { Photo } from '../../../photos/entities/photo.entity';

@Embeddable()
export class RegionDetails {

    @Property()
    x: number;

    @Property()
    y: number;

    @Property()
    width: number;

    @Property()
    height: number;

    @Property()
    rotation: number;
}

@Entity()
export class AlbumPageRegion extends BaseEntity<AlbumPageRegion, 'id'> {
    [OptionalProps]: 'page' | 'safeName' | 'isProtected';

    @PrimaryKey()
    id: number;

    @Property({ default: false })
    isProtected: boolean = false;

    @Property()
    comment?: string;

    @ManyToOne(() => AlbumPage, { onDelete: 'cascade' })
    page: AlbumPage;

    @ManyToOne(() => Photo)
    photo?: Photo;

    @Embedded(() => RegionDetails, { object: true })
    details: RegionDetails;

    @Property()
    name?: string;

    get safeName() {
        return this.name || this.id;
    }
}
