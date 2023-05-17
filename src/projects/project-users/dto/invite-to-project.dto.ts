import { IsEmailI18n, IsInI18n, IsIntI18n } from '@1creator/backend';
import { ProjectRole } from '../entities/project-role.enum';

export class InviteToProjectDto {
    @IsEmailI18n()
    email: string;

    @IsIntI18n()
    project: number;

    @IsInI18n(Object.values(ProjectRole))
    role: ProjectRole;
}
