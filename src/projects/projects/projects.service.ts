import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { GetProjectsDto } from './dto/get-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { StoreProjectDto } from './dto/store-project.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Project } from './entities/project.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder, Ref } from '@mikro-orm/core';
import { ProjectUsersService } from '../project-users/project-users.service';
import { User } from '../../users/entities/user.entity';
import { omit } from '@1creator/common';
import { Album } from '../../albums/albums/entities/album.entity';
import { AlbumsService } from '../../albums/albums/albums.service';
import { ProjectRole } from '../project-users/entities/project-role.enum';
import { ProjectGroupsService } from "../project-groups/project-groups.service";

@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private repo: EntityRepository<Project>,
        @InjectRepository(Album)
        private albumsRepo: EntityRepository<Album>,
        private readonly em: EntityManager,
        @Inject(forwardRef(() => ProjectUsersService))
        private readonly projectUsersService: ProjectUsersService,
        private readonly projectGroupsService: ProjectGroupsService,
        private readonly albumsService: AlbumsService,
    ) {
    }

    async getMany(dto: GetProjectsDto, currentUser: User) {
        const where: FilterQuery<Project> = { usersPivot: { user: currentUser } };
        if (dto.id) {
            where.id = { $in: dto.id };
        }
        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            populate: ['usersPivot.role', 'group'],
            populateWhere: { usersPivot: { user: currentUser } },
            orderBy: { id: QueryOrder.DESC },
        });
        items.forEach(i => {
            i.currentUser = currentUser;
            if (i.scope && [ProjectRole.Owner, ProjectRole.Employee].includes(i.scope.role)) {
                this.repo.populate(i, ['qr']);
            }
        });

        await this.fillDetails(items);
        return { items, count };
    }

    async get(dto: GetProjectDto, currentUser: User) {
        const res = await this.repo.findOneOrFail(
            {
                id: dto.id,
                usersPivot: { user: currentUser },
            },
            { populate: ['usersPivot', 'albums.pages.background', 'albums.pages.regions.photo.watermarked', 'prices.priceList', 'prepayments', 'group'] },
        );
        res.currentUser = currentUser;
        await this.fillDetails([res]);
        return res;
    }

    async addFavorite(dto: GetProjectDto, currentUser: User) {
        const project = await this.get(dto, currentUser);
        const [pivotEntity] = await project.usersPivot.matching({ where: { user: currentUser } });
        pivotEntity.isFavorite = true;
        await this.repo.getEntityManager().persistAndFlush(pivotEntity);
        return project;
    }

    async refreshPassword(
        dto: GetProjectDto,
        currentUser: User,
    ) {
        const item = await this.get({ id: dto.id }, currentUser);
        item.password = String(Math.floor(Math.random() * (9999 - 1000) + 1000));
        item.protectedPassword = String(Math.floor(Math.random() * (9999 - 1000) + 1000));
        this.repo.getEntityManager().flush();
        return item;
    }

    async removeFavorite(dto: GetProjectDto, currentUser: User) {
        const project = await this.get(dto, currentUser);
        const [pivotEntity] = await project.usersPivot.matching({ where: { user: currentUser } });
        pivotEntity.isFavorite = false;
        await this.repo.getEntityManager().persistAndFlush(pivotEntity);
        return project;
    }

    async store(dto: StoreProjectDto, currentUser: User) {
        const item = this.repo.create({
            ...omit(dto, ['group']),
            password: String(Math.floor(Math.random() * (9999 - 1000) + 1000)),
            protectedPassword: String(Math.floor(Math.random() * (9999 - 1000) + 1000)),
            usersPivot: [
                {
                    user: currentUser,
                    role: ProjectRole.Owner,
                },
            ],
        });

        if (dto.group) {
            item.group = await this.projectGroupsService.get(dto.group, currentUser);
            item.group.populated(true);
        }

        await this.repo.getEntityManager().flush();
        return item;
    }

    async archive(dto: GetProjectDto, currentUser: User) {
        const item = await this.get(dto, currentUser);
        item.archivedAt = new Date();
        await this.repo.getEntityManager().flush();
        return item;
    }

    async unArchive(dto: GetProjectDto, currentUser: User) {
        const item = await this.get(dto, currentUser);
        item.archivedAt = null;
        await this.repo.getEntityManager().flush();
        return item;
    }

    async update(
        dto: UpdateProjectDto,
        currentUser: User,
    ): Promise<Project> {
        const item = await this.get(dto, currentUser);
        item.assign(omit(dto, ['albums', 'group']));

        if (dto.albums) {
            const albums: Album[] = [];
            for (const album of dto.albums) {
                albums.push(album.id
                    ? await this.albumsService.update(album, currentUser)
                    : await this.albumsService.store(album, currentUser),
                );
            }
            item.albums.set(albums);
        }

        if (dto.group) {
            item.group = await this.projectGroupsService.get(dto.group, currentUser);
            item.group.populated(true);
        }
        console.log(item.group);

        await this.repo.getEntityManager().flush();
        return item;
    }

    async remove(
        dto: DeleteProjectDto,
        currentUser: User,
    ): Promise<Project> {
        const item = await this.get({ id: dto.id }, currentUser);
        await this.repo.getEntityManager().removeAndFlush(item);
        return item;
    }

    async fillDetails(projects: Project[]) {
        if (!projects.length) {
            return;
        }
        const ids = projects.map(i => i.id);

        const res: Array<{
            id: number,
            photos_count: number,
            directories_count: number,
            unloaded_orders_count: number,
            orders_count: number,
            users_count: number,
            size: number
        }> = await this.em.execute(`
            select p.id,
                   p.name,
                   count(DISTINCT ph)::int                                                           as photos_count,
                   count(DISTINCT d)::int                                                            as directories_count,
                   count(DISTINCT o)::int                                                            as orders_count,
                   count(DISTINCT pu)::int                                                           as users_count,
                   sum(DISTINCT u.size) ::int                                                        as size,
                   (count(DISTINCT o)
                    FILTER (WHERE o.status = 'work' and uo is null and o.should_unload = true))::int as unloaded_orders_count,
                   count(DISTINCT o)::int                                                            as orders_count
            from project p
                     left join directory d
                               on d.project_id = p.id
                     left join photo ph on d.id = ph.directory_id
                     left join upload u on u.uuid = ph.original_uuid or u.uuid = ph.watermarked_uuid
                     left join "order" o on p.id = o.project_id
                     left join "unloading_orders" uo on uo.order_uuid = o.uuid
                     left join "project_user" pu on pu.project_id = p.id
            where p.id in (${ids})
            group by p.id
        `);

        res.map(i => {
            projects.find(d => d.id === i.id)!.details = {
                directoriesCount: i.directories_count,
                photosCount: i.photos_count,
                unloadedOrdersCount: i.unloaded_orders_count,
                ordersCount: i.orders_count,
                usersCount: i.users_count,
                size: i.size,
            };
        });
    }

    async getProjectAgent(projectRef: Ref<Project>) {
        const project = await this.repo.findOne(projectRef, {
            populate: ['usersPivot.user.agent'],
            populateWhere: { usersPivot: { role: ProjectRole.Owner } },
        });
        return project?.usersPivot.getItems()[0].user.agent;
    }
}
