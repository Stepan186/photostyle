/*
*
* store
*       dto.name
*       dto.projects
*
* update
*       dto.id
*       dto.name
*       dto.projects
*
* remove
*       dto.id
*
* */

import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProjectGroup } from './entities/project-group.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { StoreProjectGroupDto } from './dto/store-project-group.dto';
import { ProjectUsersService } from '../project-users/project-users.service';
import { ProjectsService } from '../projects/projects.service';
import { UpdateProjectGroupDto } from './dto/update-project-group.dto';
import { ProjectPermissionType } from '../project-permissions/entities/project-permission.entity';
import { omit } from '@1creator/common';
import { IdDto } from '@1creator/backend';

@Injectable()
export class ProjectGroupsService {
    constructor(
        @InjectRepository(ProjectGroup) private repo: EntityRepository<ProjectGroup>,
        private projectUsersService: ProjectUsersService,
        private projectsService: ProjectsService,
    ) {
    }

    async get(id: number, currentUser: User) {
        const group = await this.repo.findOneOrFail(id, { populate: ['projects'] });
        if (group.owner !== currentUser) {
            throw new ForbiddenException();
        }
        return group;
    }

    async store(dto: StoreProjectGroupDto, currentUser: User) {
        const projects = await this.getMovableProjects(dto.projects, currentUser);
        const group = this.repo.create({ ...dto, projects, owner: currentUser });
        await this.repo.getEntityManager().flush();
        return group;
    }

    async update(dto: UpdateProjectGroupDto, currentUser: User) {
        const group = await this.get(dto.id, currentUser);

        group.assign(omit(dto, ['id', 'projects']));

        if (dto.projects) {
            const projects = await this.getMovableProjects(dto.projects, currentUser);
            group.projects.set(projects);
        }

        await this.repo.getEntityManager().flush();
    }

    async remove(dto: IdDto, currentUser: User) {
        const group = await this.get(dto.id, currentUser);
        await this.repo.getEntityManager().removeAndFlush(group);
        return group;
    }

    async getMovableProjects(projectIds: number[], currentUser: User) {
        const { items } = await this.projectsService.getMany({ id: projectIds }, currentUser);
        const isSomeProjectForbidden = items.some(p => !p.scope?.permissions?.includes(ProjectPermissionType.EditProject));
        if (!isSomeProjectForbidden) {
            throw new ForbiddenException();
        }
        return items;
    }
}