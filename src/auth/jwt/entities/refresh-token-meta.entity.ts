import { BaseEntity, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class RefreshTokenMeta extends BaseEntity<RefreshTokenMeta, 'uuid'> {
    @PrimaryKey({ type: 'uuid' })
    uuid: string;

    @Property()
    deviceName: string;

    @Property()
    deviceIp: string;

    @Property()
    refreshToken: string;

    @Property()
    expiresAt: Date;

    @ManyToOne(() => User, { onDelete: 'cascade' })
    user: User;
}
