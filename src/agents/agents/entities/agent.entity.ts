import {
    BaseEntity,
    Collection,
    Entity,
    ManyToMany,
    OneToMany,
    OneToOne,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Upload } from '../../../uploads/entities/upload.entity';
import { Feature, FeatureType } from '../../agent-features/entites/feature.entity';
import { AgentFeature } from '../../agent-features/entites/agent-feature.entity';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class Agent extends BaseEntity<Agent, 'uuid'> {
    [OptionalProps]: 'createdAt' | 'updatedAt';

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @Property()
    name?: string;

    @Property()
    mailAddress?: string;

    @Property()
    legalAddress?: string;

    @Property()
    email?: string;

    @Property()
    bik?: string;

    @Property()
    ogrn?: string;

    @Property()
    director?: string;

    @Property()
    inn?: string;

    @Property()
    kpp?: string;

    @Property()
    correspondentAccount?: string;

    @Property()
    bankAccount?: string;

    @OneToOne({ onDelete: 'set null' })
    watermark?: Upload;

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Property({ type: 'integer', default: 5 })
    fee: number;

    @ManyToMany({ entity: () => Feature, pivotEntity: () => AgentFeature })
    features = new Collection<Feature>(this);

    @Property({ persist: false })
    balance?: number;

    @OneToMany(() => User, u => u.agent)
    users = new Collection<User>(this);

    hasFeature(feature: FeatureType) {
        return this.features.getIdentifiers().includes(feature);
    }

    get dailyCost() {
        return this.features.getItems().reduce((acc, value) => {
            return acc + value.dailyCost;
        }, 0);
    }
}