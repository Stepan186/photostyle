import {
    BaseEntity,
    Collection,
    Entity,
    Enum,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
    Unique,
} from '@mikro-orm/core';
import { User } from '../../../users/entities/user.entity';
import { OrderAlbum } from '../../order-album/entities/order-album.entity';
import { OrderPhoto } from '../../order-photos/entities/order-photo.entity';
import { PriceList } from '../../../prices/entities/price-list.entity';
import { Project } from '../../../projects/projects/entities/project.entity';
import { Unloading } from '../../../unloadings/entities/unloading.entity';

export enum OrderStatus {
    Cart = 'cart',
    New = 'new',
    Payment = 'payment',
    Work = 'work',
    Completed = 'completed',
}

export type OrderId = `${number}-${number}`;

@Entity()
export class Order extends BaseEntity<Order, 'uuid'> {
    [OptionalProps]: 'localizedStatus' | 'createdAt' | 'updatedAt';

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @Unique()
    @Property()
    id: OrderId;

    @ManyToOne(() => User)
    creator: User;

    @ManyToOne(() => User)
    user: User;

    @Enum({ default: OrderStatus.Cart })
    status: OrderStatus;

    @ManyToOne(() => Project)
    project: Project;

    @OneToMany(() => OrderAlbum, 'order', { orphanRemoval: true })
    albums = new Collection<OrderAlbum>(this);

    @OneToMany(() => OrderPhoto, 'order', { orphanRemoval: true })
    photos = new Collection<OrderPhoto>(this);

    @Property()
    createdAt: Date = new Date();

    @Property()
    completedAt?: Date;

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Property({ nullable: true })
    address?: string;

    @Property({ nullable: true })
    comment?: string;

    @Property({ nullable: true })
    privateComment?: string;

    @Property({ persist: false })
    activePriceList?: PriceList;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    total: number;

    @Property({ default: 0 })
    sale: number;

    @Property({ default: 0 })
    salePercent: number;

    @ManyToMany(() => Unloading, 'orders')
    unloadings = new Collection<Unloading>(this);

    @Property({ default: false })
    shouldUnload: boolean;

    @Property({ persist: false })
    get localizedStatus() {
        return {
            [OrderStatus.Cart]: 'Оформление',
            [OrderStatus.New]: 'Новый',
            [OrderStatus.Work]: 'В работе',
            [OrderStatus.Payment]: 'Оплата',
            [OrderStatus.Completed]: 'Выполнено',
        }[this.status];
    }
}