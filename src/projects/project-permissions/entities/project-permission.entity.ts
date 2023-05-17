import { BaseEntity, Entity, PrimaryKey, PrimaryKeyType, Property } from '@mikro-orm/core';

export enum ProjectPermissionType {
    EditProject = 'projects.edit',
    UploadPhotos = 'photos.upload',

    EditPermissions = 'permissions.edit',

    ViewOrders = 'orders.view',
    EditOrders = 'orders.edit',

    ViewAlbums = 'albums.view',
    EditAlbums = 'albums.edit',

    ViewUsers = 'users.view',
    EditUsers = 'users.edit',
}

@Entity()
export class ProjectPermission extends BaseEntity<ProjectPermission, 'id'> {
    [PrimaryKeyType]: ProjectPermissionType;

    @PrimaryKey({ type: 'string' })
    id: ProjectPermissionType;

    @Property()
    description: string;
}