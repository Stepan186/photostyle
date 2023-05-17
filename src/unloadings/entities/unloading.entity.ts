import {
    BaseEntity,
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Order } from '../../orders/order/entities/order.entity';
import { Upload } from '../../uploads/entities/upload.entity';

@Entity()
export class Unloading extends BaseEntity<Unloading, 'id'> {
    [OptionalProps]: 'createdAt';

    @PrimaryKey()
    id: number;

    @ManyToMany(() => Order)
    orders = new Collection<Order>(this);

    @Property({ type: 'float' })
    totalCost?: number;

    @ManyToOne()
    upload?: Upload;

    @ManyToOne(() => User)
    user: User;

    @Property()
    createdAt: Date = new Date();
}