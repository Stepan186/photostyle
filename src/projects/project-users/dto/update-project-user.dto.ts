import { IsArrayI18n, IsInI18n, IsNumberI18n, IsStringI18n } from '@1creator/backend';
import { IsEnum } from 'class-validator';
import { ProjectPermissionType } from '../../project-permissions/entities/project-permission.entity';

export class UpdateProjectUserDto {
    @IsStringI18n()
    user: string;

    @IsNumberI18n()
    project: number;

    @IsInI18n(Object.values(ProjectPermissionType), { each: true })
    @IsArrayI18n()
    permissions: ProjectPermissionType[];
}