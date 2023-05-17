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
import { PriceItem } from './price-item.entity';
import { ProjectPrice } from '../../projects/projects/entities/project-price.entity';
import { User } from "../../users/entities/user.entity";

@Entity()
export class PriceList extends BaseEntity<PriceList, 'id'> {
    [OptionalProps]: 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @ManyToOne(() => User)
    user: User;

    @OneToMany(() => PriceItem, 'list', { orphanRemoval: true })
    items = new Collection<PriceItem>(this);

    @OneToMany(() => ProjectPrice, 'priceList')
    projectsPivot = new Collection<ProjectPrice>(this);

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
