import { Injectable } from '@nestjs/common';
import { GetDirectoriesDto } from './dto/get-directories.dto';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { StoreDirectoryDto } from './dto/store-directory.dto';
import { DeleteDirectoryDto } from './dto/delete-directory.dto';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Directory } from './entities/directory.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { GetDirectoryDto } from './dto/get-directory.dto';
import { User } from '../users/entities/user.entity';
import { Action } from '../auth/types/action';
import { ProjectUsersService } from '../projects/project-users/project-users.service';
import { ProjectPermissionType } from '../projects/project-permissions/entities/project-permission.entity';
import { PriceItem } from "../prices/entities/price-item.entity";
import { PriceItemsService } from "../prices/price-items.service";

@Injectable()
export class DirectoriesService {
    constructor(
        @InjectRepository(Directory) private repo: EntityRepository<Directory>,
        private readonly em: EntityManager,
        private projectUsersService: ProjectUsersService,
        private priceItemsService: PriceItemsService,
    ) {
    }

    async getMany(dto: GetDirectoriesDto, currentUser: User) {
        const where: FilterQuery<Directory> = { project: { usersPivot: { user: currentUser } } };

        if (dto.id) {
            where.id = { $in: dto.id };
        }

        if (dto.search) {
            where.name = { $ilike: `%${dto.search}%` };
        }

        if (dto.parent !== undefined) {
            where.parent = dto.parent;
        }

        if (dto.project) {
            where.project = dto.project;
        }

        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { id: QueryOrder.DESC },
        });
        await this.fillDetails(items);
        return { items, count };
    }

    async get(dto: GetDirectoryDto, currentUser: User, action: Action = 'view') {
        const directory = await this.repo.findOneOrFail({
            id: dto.id,
            project: { usersPivot: { user: currentUser } },
        }, { populate: ['project.usersPivot'] });
        directory.project.currentUser = currentUser;

        if (action === 'edit') {
            await this.projectUsersService.checkPermissions(directory.project, currentUser, ProjectPermissionType.UploadPhotos);
        }

        if (dto.full) {
            await this.repo.populate(directory, [
                'disabledPriceItems',
                'directories',
                'parent',
                'photos.original',
                'photos.watermarked',
            ]);
            await this.fillDetails([directory, ...directory.directories.getItems()]);
        }

        return directory;
    }

    async store(dto: StoreDirectoryDto, currentUser: User) {
        const parent = dto.parent ? await this.get({ id: dto.parent }, currentUser, 'edit') : undefined;

        const directory = this.repo.create({
            ...dto,
            parent,
        });

        if (dto.disabledPriceItems) {
            const { items: priceItems } = await this.priceItemsService.getMany(
                { id: dto.disabledPriceItems },
                currentUser
            );
            directory.disabledPriceItems.set(priceItems);
        }

        await this.repo.getEntityManager().flush();
        await this.updateTree(dto.project);
        return directory;
    }

    async update(
        dto: UpdateDirectoryDto,
        currentUser: User,
    ): Promise<Directory> {
        const directory = await this.get({ id: dto.id, full: true }, currentUser, 'edit');
        directory.assign(dto);

        if (dto.disabledPriceItems) {
            const { items: priceItems } = await this.priceItemsService.getMany(
                { id: dto.disabledPriceItems },
                currentUser
            );
            directory.disabledPriceItems.set(priceItems);
        }

        await this.repo.getEntityManager().flush();
        return directory;
    }

    async remove(
        dto: DeleteDirectoryDto,
        currentUser: User,
    ): Promise<Directory> {
        const item = await this.get({ id: dto.id }, currentUser, 'edit');
        await this.repo.getEntityManager().removeAndFlush(item);
        return item;
    }

    async updateTree(projectId: number) {
        const directories = await this.repo.find({ project: projectId }, { populate: ['directories'] });
        const root = directories.filter(i => !i.parent);

        const fc = (
            item: Directory,
            level: number,
            edgeCounter: number,
            treeId: number,
        ) => {
            item.treeLevel = level;
            item.treeLeft = edgeCounter;
            item.treeId = treeId;
            item.directories.getItems().forEach(
                (child) =>
                    (edgeCounter = fc(child, level + 1, ++edgeCounter, treeId)),
            );
            item.treeRight = ++edgeCounter;
            return edgeCounter;
        };
        root.forEach((i, idx) => fc(i, 0, 1, idx));

        await this.repo.getEntityManager().flush();
    }

    async fillDetails(directories: Directory[]) {
        if (!directories.length) {
            return;
        }

        const ids = directories.map(i => i.id);

        const res: Array<{
            id: number,
            photos_count: number,
            directories_count: number,
            size: number
        }> = await this.em.execute(`
            select d.id,
                   d.name,
                   count(p)::int     as photos_count,
                   count(d2)::int    as directories_count,
                   sum(u.size) ::int as size
            from directory d
                     left join directory d2
                               on d.project_id = d2.project_id and d2.tree_left > d.tree_left and
                                  d2.tree_right < d.tree_right
                     left join photo p on d2.id = p.directory_id or d.id = p.directory_id
                     left join upload u on u.uuid = p.original_uuid
            where d.id IN (${ids})
            group by d.id
        `);

        res.map(i => {
            const directory = directories.find(d => d.id === i.id);
            if (directory) {
                directory.details = {
                    directoriesCount: i.directories_count,
                    photosCount: i.photos_count,
                    size: i.size,
                };
            }
        });
    }
}

