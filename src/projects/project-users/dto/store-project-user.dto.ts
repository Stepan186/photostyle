import { IsInI18n, IsIntI18n, IsUuidI18n } from '@1creator/backend';
import { ProjectRole } from '../entities/project-role.enum';
import { IsOptional } from 'class-validator';
import { ProjectPermissionType } from '../../project-permissions/entities/project-permission.entity';

export class StoreProjectUserDto {
    @IsUuidI18n()
    user: string;

    @IsIntI18n()
    project: number;

    @IsInI18n(Object.values(ProjectRole))
    role: ProjectRole;

    @IsOptional()
    @IsInI18n(Object.values(ProjectPermissionType), { each: true })
    permissions?: ProjectPermissionType[];
}
