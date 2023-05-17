import {
    BaseEntity,
    Collection,
    Entity,
    Enum,
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
@Entity()
export class ProjectUser extends BaseEntity<ProjectUser, 'user' | 'project'> {
    [PrimaryKeyType]: [string, number];
    [OptionalProps]: 'localizedRole' | 'isFavorite';

    // @PrimaryKey()
    // id: number;

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

    @Property({ type: 'uuid' })
    inviteUuid?: string | null;
}