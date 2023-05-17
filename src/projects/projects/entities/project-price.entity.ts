import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { PriceList } from '../../../prices/entities/price-list.entity';
import { Project } from './project.entity';

@Entity()
export class ProjectPrice extends BaseEntity<ProjectPrice, 'id'> {
    @PrimaryKey()
    id: number;

    @ManyToOne(() => Project)
    project: Project;

    @ManyToOne(() => PriceList)
    priceList: PriceList;

    @Property({ type: 'date', nullable: true })
    expiresAt?: Date;
}
