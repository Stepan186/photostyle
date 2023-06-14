import { ForbiddenException, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { ProjectGroup } from './entities/project-group.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { StoreProjectGroupDto } from './dto/store-project-group.dto';
import { UpdateProjectGroupDto } from './dto/update-project-group.dto';
import { omit } from '@1creator/common';
import { IdDto, PaginationDto } from '@1creator/backend';

@Injectable()
export class ProjectGroupsService {
    constructor(
        @InjectRepository(ProjectGroup) private repo: EntityRepository<ProjectGroup>,
        // private projectsService: ProjectsService,
    ) {
    }

    async getMany(dto: PaginationDto, currentUser: User) {
        const [items, count] = await this.repo.findAndCount({ owner: currentUser }, {
            limit: dto.limit,
            offset: dto.offset,
        });
        return { items, count };
    }

    async get(id: number, currentUser: User) {
        const group = await this.repo.findOneOrFail(id, { populate: ['projects'] });
        if (group.owner !== currentUser) {
            throw new ForbiddenException();
        }
        return group;
    }

    async store(dto: StoreProjectGroupDto, currentUser: User) {
        // const projects = dto.projects?.length ? await this.getMovableProjects(dto.projects, currentUser) : [];
        const group = this.repo.create({ ...dto, owner: currentUser });
        await this.repo.getEntityManager().flush();
        return group;
    }

    async update(dto: UpdateProjectGroupDto, currentUser: User) {
        const group = await this.get(dto.id, currentUser);

        group.assign(omit(dto, ['id', 'projects']));

        // if (dto.projects) {
        //     const projects = await this.getMovableProjects(dto.projects, currentUser);
        //     group.projects.set(projects);
        // }

        await this.repo.getEntityManager().flush();
    }

    async remove(dto: IdDto, currentUser: User) {
        const group = await this.get(dto.id, currentUser);
        await this.repo.getEntityManager().removeAndFlush(group);
        return group;
    }

    // async getMovableProjects(projectIds: number[], currentUser: User) {
    //     const { items } = await this.projectsService.getMany({ id: projectIds }, currentUser);
    //     const isSomeProjectForbidden = items.some(p => !p.scope?.permissions?.includes(ProjectPermissionType.EditProject));
    //     if (!isSomeProjectForbidden) {
    //         throw new ForbiddenException();
    //     }
    //     return items;
    // }
}