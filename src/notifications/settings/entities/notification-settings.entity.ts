import { BaseEntity, Entity, OneToOne, Property } from '@mikro-orm/core';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class NotificationSettings extends BaseEntity<
    NotificationSettings,
    'user'
> {
    @OneToOne({ primary: true })
    user: User;

    @Property({ default: true })
    email: boolean;

    @Property({ onUpdate: () => new Date() })
    updatedAt?: Date = new Date();
}
