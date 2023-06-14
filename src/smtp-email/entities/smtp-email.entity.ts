import { BaseEntity, Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class SmtpEmail extends BaseEntity<SmtpEmail, 'id'> {

    @PrimaryKey()
    id: number;

    @Property()
    email: string;

    @Property()
    password: string;

    @Property()
    userName: string;

}