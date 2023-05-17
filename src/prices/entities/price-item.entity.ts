import { BaseEntity, Collection, Entity, ManyToMany, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PriceList } from './price-list.entity';
import { Upload } from '../../uploads/entities/upload.entity';

@Entity()
export class PriceItem extends BaseEntity<PriceItem, 'id'> {
    @PrimaryKey()
    id: number;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    price: number;

    @Property()
    name: string;

    @Property()
    serviceName: string;

    @ManyToOne(() => PriceList)
    list: PriceList;

    @ManyToMany(() => Upload)
    examples = new Collection<Upload>(this);

    @Property({ default: false })
    isElectronic: boolean;
}
