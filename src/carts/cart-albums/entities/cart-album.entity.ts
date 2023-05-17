import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Cart } from '../../carts/entities/cart.entity';
import { AlbumComposition } from '../../../albums/compositions/entities/album-composition.entity';

@Entity()
export class CartAlbum extends BaseEntity<CartAlbum, 'id'> {
    [OptionalProps]: 'sale' | 'salePercent' | 'price';

    @PrimaryKey()
    id: number;

    @Property()
    count: number;

    @ManyToOne(() => AlbumComposition)
    composition: AlbumComposition;

    @ManyToOne(() => Cart, { onDelete: 'cascade', hidden: true })
    cart: Cart;

    @Property({ persist: false })
    get price(): number {
        return this.composition.price - this.sale;
    }

    @Property({ persist: false })
    get sale(): number {
        return this.salePercent
            ? this.composition.album.price * this.salePercent / 100
            : 0;
    }

    @Property({ persist: false })
    get salePercent(): number {
        return this.cart.salePercent;
    }
}
