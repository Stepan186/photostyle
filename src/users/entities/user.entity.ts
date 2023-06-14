import {
    BaseEntity,
    Check,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    OneToOne,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { ProjectUser } from '../../projects/project-users/entities/project-user.entity';
import { Agent } from '../../agents/agents/entities/agent.entity';
import { Upload } from '../../uploads/entities/upload.entity';
import { Order } from '../../orders/order/entities/order.entity';

@Entity()
export class User extends BaseEntity<User, 'uuid'> {
    [OptionalProps]: 'fullName' | 'isAdmin' | 'isAgent' | 'createdAt' | 'updatedAt';

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @Property({ nullable: true })
    firstName?: string;

    @Property({ nullable: true })
    lastName?: string;

    @Property({ unique: true, nullable: true })
    phone?: string;

    @Property({ default: false })
    isAgent: boolean;

    @Property({ default: false })
    isAdmin: boolean;

    @Property({ unique: true })
    @Check({ expression: 'email = lower(email)' })
    email: string;

    @Property({ nullable: true })
    telegramChatId?: string;

    @ManyToOne(() => Agent)
    agent?: Agent;

    @Property({ hidden: true })
    password?: string;

    @Property()
    createdAt: Date = new Date();

    @Property()
    updatedAt: Date = new Date();

    @OneToOne(() => Upload, { nullable: true })
    image?: Upload;

    // @ManyToMany({ entity: () => Project, pivotEntity: () => ProjectUser })
    // projects = new Collection<Project>(this);

    @OneToMany(() => ProjectUser, pu => pu.user)
    projectsPivot = new Collection<ProjectUser>(this);

    @OneToMany(() => Order, o => o.user)
    orders = new Collection<Order>(this);

    @Property({ persist: false })
    get fullName() {
        return [this.lastName, this.firstName].filter(i => i).join(' ') || `Пользователь`;
    }
}
