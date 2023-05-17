import {
    BaseEntity,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { ProjectUser } from '../../project-users/entities/project-user.entity';
import { User } from '../../../users/entities/user.entity';
import { Directory } from '../../../directories/entities/directory.entity';
import { Album } from '../../../albums/albums/entities/album.entity';
import { ProjectPrice } from './project-price.entity';
import { Order } from '../../../orders/order/entities/order.entity';
import { ProjectPermissionType } from '../../project-permissions/entities/project-permission.entity';
import { ProjectGroup } from '../../project-groups/entities/project-group.entity';
import { ProjectRole } from "../../project-users/entities/project-role.enum";
import * as process from "process";

export class ProjectDetails {
    directoriesCount = 0;
    photosCount = 0;
    unloadedOrdersCount = 0;
    ordersCount = 0;
    usersCount = 0;
    size = 0;
}

@Entity()
export class Project extends BaseEntity<Project, 'id'> {
    [OptionalProps]: 'isFavorite' | 'waitingForPrepayment' | 'createdAt' | 'updatedAt'
        | 'salePercent'
        | 'permissions'
        | 'scope'
        | 'qr'
        | 'prepayment';

    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @Property()
    publicName: string;

    @Property()
    city: string;

    @Property({ nullable: true })
    shareTemplate?: string;

    @Property({ nullable: true })
    address?: string;

    @Property({ type: 'date', nullable: true })
    shootingDate?: Date;

    @Property({ nullable: true })
    comment?: string;

    @Property({ nullable: true })
    additionalInformation?: string;

    @Property({ nullable: true })
    organizerName?: string;

    @Property({ nullable: true })
    organizerPerson?: string;

    @Property({ nullable: true })
    organizerPersonPhone?: string;

    @Property({ default: false })
    hasMultipleClients?: boolean;

    @Property({ default: false })
    requestClientAddress?: boolean;

    @Property({ default: 0, check: `sale_percent >= 0 AND sale_percent <= 100` })
    salePercent: number;

    @Property({ nullable: true })
    saleUntil?: Date;

    @Property({ nullable: true })
    archivedAt?: Date | null;

    @Property({ persist: false })
    details?: ProjectDetails = new ProjectDetails();

    @OneToMany(() => ProjectPrice, (d) => d.project, { orphanRemoval: true })
    prices = new Collection<ProjectPrice>(this);

    @OneToMany(() => Directory, (d) => d.project)
    directories = new Collection<Directory>(this);

    @Property({ nullable: true })
    password?: string;

    @Property({ nullable: true })
    protectedPassword?: string;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    prepayment: number;

    @ManyToOne(() => ProjectGroup, { onDelete: 'cascade' })
    group?: ProjectGroup;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();

    // @ManyToMany({ entity: () => User, mappedBy: u => u.projects })
    // users = new Collection<User>(this);

    @OneToMany(() => ProjectUser, pu => pu.project, { hidden: true })
    usersPivot = new Collection<ProjectUser>(this);

    @OneToMany(() => Order, 'project')
    orders = new Collection<Order>(this);

    @OneToMany(() => Album, pa => pa.project, { orphanRemoval: true })
    albums = new Collection<Album>(this);

    @Property({ persist: false })
    get isFavorite() {
        if (!this.currentUser || !this.usersPivot.isInitialized()) {
            return;
        }

        return this.usersPivot.getItems().find(i => i.user === this.currentUser)?.isFavorite;
    }

    @Property({ persist: false, lazy: true })
    get qr() {
        const url = `cht=qr&chs=250x250&choe=UTF-8&chld=L|0&chl=${process.env.FRONTEND_URL}/add-project?id=${this.id}%26password=${this.password}`;
        return 'https://chart.googleapis.com/chart?' + url;
    }

    @Property({ persist: false })
    get scope(): { role: ProjectRole, permissions: ProjectPermissionType[] } | undefined {
        if (!this.currentUser || !this.usersPivot.isInitialized()) {
            return undefined;
        }

        const up = this.usersPivot.getItems().find(i => i.user === this.currentUser);
        if (up) {
            let permissions: ProjectPermissionType[];
            if (up.role === ProjectRole.Owner) {
                permissions = Object.values(ProjectPermissionType);
            } else {
                permissions = up.permissions.isInitialized() ? up.permissions.getIdentifiers() : [];
            }
            return {
                role: up.role,
                permissions,
            };
        } else {
            return undefined;
        }
    }

    @Property({ persist: false })
    get waitingForPrepayment() {
        return this.prepayment > 0;
    }

    currentUser?: User;
}
