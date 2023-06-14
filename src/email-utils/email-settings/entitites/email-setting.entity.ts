import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class EmailSetting extends BaseEntity<EmailSetting, 'id'> {
    @PrimaryKey()
    id: number;

    @Property()
    host: string;

    @Property()
    port: string;

    @Property()
    encryption: string;

    @Property()
    mailFrom: string;

    @Property()
    userName: string;

    @Property()
    password: string;
}