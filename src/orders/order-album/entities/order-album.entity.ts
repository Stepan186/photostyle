import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Order } from '../../order/entities/order.entity';
import { AlbumComposition } from '../../../albums/compositions/entities/album-composition.entity';

@Entity()
export class OrderAlbum extends BaseEntity<OrderAlbum, 'id'> {
    [OptionalProps]: 'salePercent';

    @PrimaryKey()
    id: number;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    price: number;

    @Property()
    count: number;

    @ManyToOne(() => AlbumComposition)
    composition: AlbumComposition;

    @ManyToOne(() => Order, { onDelete: 'cascade', hidden: true })
    order: Order;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    sale: number;

    @Property({ persist: false })
    get salePercent(): number {
        return this.order.salePercent;
    }
}
