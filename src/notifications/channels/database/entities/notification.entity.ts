import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../../users/entities/user.entity';

@Entity()
export class Notification {
    @PrimaryKey()
    id: number;

    @ManyToOne()
    user: User;

    @Property()
    title: string;

    @Property()
    text: string;

    @Property({ type: 'json', nullable: true })
    payload?: any;

    @Property({ type: 'timestamp', nullable: true })
    readAt?: Date;

    @Property()
    createdAt?: Date = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt?: Date = new Date();
}
