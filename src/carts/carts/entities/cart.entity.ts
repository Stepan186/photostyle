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
import { User } from '../../../users/entities/user.entity';
import { CartAlbum } from '../../cart-albums/entities/cart-album.entity';
import { CartPhoto } from '../../cart-photos/entities/cart-photo.entity';
import { PriceList } from '../../../prices/entities/price-list.entity';
import { Project } from '../../../projects/projects/entities/project.entity';
import { ApiErrorDetails } from '@1creator/common';
import { Photo } from "../../../photos/entities/photo.entity";
import { PriceItem } from "../../../prices/entities/price-item.entity";

@Entity()
export class Cart extends BaseEntity<Cart, 'uuid'> {
    [OptionalProps]: 'total' | 'sale' | 'salePercent' | 'photoGroups';

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user: User;

    @ManyToOne(() => Project)
    project: Project;

    @OneToMany(() => CartAlbum, 'cart', { orphanRemoval: true })
    albums = new Collection<CartAlbum>(this);

    @OneToMany(() => CartPhoto, 'cart', { orphanRemoval: true })
    photos = new Collection<CartPhoto>(this);

    @Property({ nullable: true })
    comment?: string;

    @Property({ nullable: true })
    address?: string;

    @Property({ persist: false })
    activePriceList?: PriceList;

    @Property({ persist: false })
    get total(): number {
        return [...this.photos.getItems(), ...this.albums.getItems()].reduce((acc, i) => acc + i.price * i.count, 0);
    }

    @Property({ persist: false })
    get sale(): number {
        return [...this.photos.getItems(), ...this.albums.getItems()].reduce((acc, i) => acc + i.sale * i.count, 0);
    }

    @Property({ persist: false })
    get salePercent(): number {
        return this.project.saleUntil && this.project.saleUntil > new Date()
            ? this.project.salePercent
            : 0;
    }

    @Property({ persist: false })
    get photoGroups(): Array<{ photo: Photo, formats: { priceItem: PriceItem, count: number }[] }> | undefined {
        if (!this.photos.isInitialized()) {
            return undefined;
        }

        const cartPhotos = this.photos.getItems().reduce((acc, i) => {
            if (!acc.some(k => k.photo === i.photo)) {
                acc.push(i);
            }
            return acc;
        }, [] as CartPhoto[]);

        return cartPhotos.map(i => {
            return {
                photo: i.photo,
                formats: i.allowedFormats!.map(f => {
                    return {
                        priceItem: f,
                        count: this.photos.getItems().find(k => k.photo == i.photo && k.priceItem === f)?.count || 0,
                    };
                }),
            };
        });
    }

    getErrors() {
        const albumsErrors: ApiErrorDetails<any> = {};

        for (let i = 0; i < this.albums.length; i++) {
            const albumErrors = this.albums[i].composition.getErrors();
            if (albumErrors) {
                albumsErrors[i] = albumErrors;
            }
        }

        if (Object.keys(albumsErrors).length) {
            return { albums: albumsErrors };
        }
    }
}