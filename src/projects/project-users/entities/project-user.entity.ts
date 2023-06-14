import {
    BaseEntity,
    Collection,
    Entity,
    Enum,
    Index,
    ManyToMany,
    ManyToOne,
    OptionalProps,
    PrimaryKeyType,
    Property,
    Unique,
} from '@mikro-orm/core';
import { User } from '../../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { localizeProjectRole, ProjectRole } from './project-role.enum';
import { ProjectPermission } from '../../project-permissions/entities/project-permission.entity';

@Unique({ properties: ['user', 'project'] })
// @Index({ properties: ['user', 'role'] })
@Entity()
export class ProjectUser extends BaseEntity<ProjectUser, 'user' | 'project'> {
    [PrimaryKeyType]: [string, number];
    [OptionalProps]: 'localizedRole' | 'isFavorite' | 'prepaymentBalance' | 'prepaymentUsed';

    @ManyToOne(() => User, { onDelete: 'cascade', primary: true })
    user: User;

    @ManyToOne(() => Project, { onDelete: 'cascade', primary: true })
    project: Project;

    @ManyToMany(() => ProjectPermission)
    permissions = new Collection<ProjectPermission>(this);

    @Enum(() => ProjectRole)
    role: ProjectRole;

    @Property({ persist: false })
    get localizedRole() {
        return localizeProjectRole(this.role);
    }

    @Property({ default: false })
    isFavorite: boolean;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    prepaymentBalance: string;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    prepaymentUsed: string;

    @Property({ type: 'uuid' })
    inviteUuid?: string | null;
}