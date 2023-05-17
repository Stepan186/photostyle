import { BaseEntity, Collection, Entity, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { User } from '../../../users/entities/user.entity';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class ProjectGroup extends BaseEntity<ProjectGroup, 'id'> {
    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @ManyToOne(() => User)
    owner: User;

    @OneToMany(() => Project, p => p.group, { orphanRemoval: true })
    projects = new Collection<Project>(this);

}