import { BaseEntity, Entity, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';

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

    @Property()
    createdAt: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Property({ type: 'decimal', default: 5 })
    fee: string | number;
}