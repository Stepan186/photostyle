import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Photo } from '../../../photos/entities/photo.entity';
import { Cart } from '../../carts/entities/cart.entity';
import { PriceItem } from '../../../prices/entities/price-item.entity';

@Entity()
export class CartPhoto extends BaseEntity<CartPhoto, 'cart' | 'photo' | 'priceItem'> {
    [OptionalProps]: 'price' | 'sale' | 'salePercent';
    [PrimaryKeyType]?: [string, number, number];

    @ManyToOne(() => Cart, { primary: true, onDelete: 'cascade', hidden: true })
    cart: Cart;

    @ManyToOne(() => Photo, { primary: true, onDelete: 'cascade' })
    photo: Photo;

    @ManyToOne(() => PriceItem, { primary: true, onDelete: 'cascade' })
    priceItem: PriceItem;

    @Property()
    count: number;

    @Property({ persist: false })
    get price(): number {
        return this.priceItem.price - this.sale;
    }

    @Property({ persist: false })
    get sale(): number {
        return this.cart.salePercent
            ? this.priceItem.price * this.salePercent / 100
            : 0;
    }

    @Property({ persist: false })
    get salePercent(): number {
        return this.cart.salePercent;
    }
}