import { BaseEntity, Entity, Enum, PrimaryKey, Property } from '@mikro-orm/core';

export enum PaymentType {
    Invoice = 'invoice',
    AlfaBank = 'alfaBank'
}

export enum PaymentStatus {
    Created = 'created',
    Pending = 'pending',
    Succeeded = 'succeeded',
    Failed = 'failed',
    Refunded = 'refunded'
}

export enum PaymentTableType {
    Agent = 'agent',
    Client = 'client'
}

@Entity({
    discriminatorColumn: 'table',
    abstract: true,
})
export class Payment extends BaseEntity<Payment, 'uuid'> {
    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @Enum(() => PaymentType)
    type: PaymentType;

    @Enum(() => PaymentTableType)
    table: PaymentTableType;

    @Enum(() => PaymentStatus)
    status: PaymentStatus;

    @Property()
    description: string;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    total: number;

    @Property({ type: 'json' })
    bankPayload: JSON;

    @Property()
    paidAt: Date;

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Property()
    createdAt = new Date();
}
