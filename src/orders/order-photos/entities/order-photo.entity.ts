import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Photo } from '../../../photos/entities/photo.entity';
import { Order } from '../../order/entities/order.entity';
import { PriceItem } from '../../../prices/entities/price-item.entity';

@Entity()
export class OrderPhoto extends BaseEntity<OrderPhoto, 'order' | 'photo' | 'priceItem'> {
    [OptionalProps]: 'salePercent';
    [PrimaryKeyType]?: [string, number, number];

    @ManyToOne(() => Order, { primary: true, onDelete: 'cascade', hidden: true })
    order: Order;

    @ManyToOne(() => Photo, { primary: true })
    photo: Photo;

    @ManyToOne(() => PriceItem, { primary: true })
    priceItem: PriceItem;

    @Property()
    count: number;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    price: number;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    sale: number;

    @Property({ persist: false })
    get salePercent(): number {
        return this.order.salePercent;
    }
}