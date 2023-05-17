import {
    BaseEntity,
    Collection,
    Entity,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    PrimaryKeyType,
    Property,
} from '@mikro-orm/core';
import { AgentFeature } from './agent-feature.entity';


export enum FeatureType {
    Branding = 'branding'
}


@Entity()
export class Feature extends BaseEntity<Feature, 'id'> {
    [PrimaryKeyType]: FeatureType;
    [OptionalProps]: 'dailyCost';

    @PrimaryKey({ type: 'string' })
    id: FeatureType;

    @Property()
    title: string;

    @Property({ nullable: true })
    description?: string;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    price: string | number;

    @Property()
    image?: string;

    @OneToMany(() => AgentFeature, af => af.feature)
    agentFeatures = new Collection<AgentFeature>(this);

    @Property({ persist: false })
    get dailyCost() {
        return +((+this.price / 30).toFixed(2));
    }
}