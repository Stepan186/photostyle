import { BaseEntity, Entity, Enum, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';

export enum PaymentType {
    Invoice = 'invoice',
    Online = 'online'
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
    Order = 'order',
    ProjectPrepayment = 'project_prepayment'
}

@Entity({
    discriminatorColumn: 'table',
    abstract: true,
})
export class Payment extends BaseEntity<Payment, 'uuid'> {
    [OptionalProps]: 'createdAt' | 'updatedAt' | 'table' | 'kind';

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @Enum(() => PaymentType)
    type: PaymentType;

    @Enum(() => PaymentTableType)
    table: PaymentTableType;

    @Enum(() => PaymentStatus)
    status: PaymentStatus;

    @ManyToOne(() => User)
    user: User;

    @Property()
    description: string;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    total: number | string;

    @Property({ type: 'json', nullable: true })
    bankPayload?: JSON;

    @Property({ nullable: true })
    paidAt?: Date;

    @Property({ onUpdate: () => new Date() })
    updatedAt: Date = new Date();

    @Property()
    createdAt = new Date();

    @Property({ persist: false })
    get kind() {
        return {
            [PaymentTableType.Order]: 'Оплата заказа',
            [PaymentTableType.ProjectPrepayment]: 'Предоплата за проект',
            [PaymentTableType.Agent]: 'Пополнение баланса фотографа',
        }[this.table];
    }
}
