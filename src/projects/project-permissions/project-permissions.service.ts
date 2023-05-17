import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { MikroORM, RequiredEntityData, UseRequestContext } from '@mikro-orm/core';
import { ProjectPermission, ProjectPermissionType } from './entities/project-permission.entity';

export const SYSTEM_PERMISSIONS: Array<RequiredEntityData<ProjectPermission>> = [
    {
        id: ProjectPermissionType.EditProject,
        description: 'Редактирование проекта',
    },
    {
        id: ProjectPermissionType.UploadPhotos,
        description: 'Загрузка фотографий',
    },
    {
        id: ProjectPermissionType.ViewOrders,
        description: 'Просмотр списка заказов',
    },
    {
        id: ProjectPermissionType.EditOrders,
        description: 'Редактирование заказов',
    },
    {
        id: ProjectPermissionType.EditAlbums,
        description: 'Редактирование альбомов',
    },
    {
        id: ProjectPermissionType.ViewAlbums,
        description: 'Просмотр списка альбомов',
    },
    {
        id: ProjectPermissionType.ViewUsers,
        description: 'Просмотр списка пользователей',
    },
    {
        id: ProjectPermissionType.EditUsers,
        description: 'Редактирование пользователей',
    },
    {
        id: ProjectPermissionType.EditPermissions,
        description: 'Редактирование прав доступа',
    },
];

@Injectable()
export class ProjectPermissionsService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(ProjectPermission)
        private repo: EntityRepository<ProjectPermission>,
        private readonly orm: MikroORM,
    ) {
    }

    @UseRequestContext()
    async onApplicationBootstrap() {
        try {
            await this.syncPermissions();
        } catch (e) {
            console.error(e);
        }
    }

    async syncPermissions() {
        const ids = SYSTEM_PERMISSIONS.map((i) => i.id!);
        await this.repo.nativeDelete({ $not: { id: { $in: ids } } });

        await this.repo
            .createQueryBuilder()
            .insert(SYSTEM_PERMISSIONS)
            .onConflict('id')
            .merge()
            .execute();

        console.log('successfully synced permissions');
    }

    getMany(dto: { id?: ProjectPermissionType[] }): ProjectPermission[] {
        const permissions = SYSTEM_PERMISSIONS.map((p) => this.repo.merge(p));
        return dto.id ? permissions.filter(p => dto.id!.includes(p.id)) : permissions;
    }
}