import { ForbiddenException, forwardRef, Inject, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { ProjectUser } from './entities/project-user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { StoreProjectUserDto } from './dto/store-project-user.dto';
import { GetProjectUsersDto } from './dto/get-project-users.dto';
import { DeleteProjectUserDto } from './dto/delete-project-user.dto';
import { User } from '../../users/entities/user.entity';
import { Project } from '../projects/entities/project.entity';
import { InviteToProjectDto } from './dto/invite-to-project.dto';
import { UsersService } from '../../users/users.service';
import { v4 as uuid } from 'uuid';
import { AcceptInviteToProjectDto } from './dto/accept-invite-to-project.dto';
import { JoinProjectDto } from '../projects/dto/join-project.dto';
import { ProjectRole } from './entities/project-role.enum';
import { ProjectsService } from '../projects/projects.service';
import { createValidationException } from '@1creator/backend';
import { ProjectPermissionType } from '../project-permissions/entities/project-permission.entity';
import { Ref, ref } from '@mikro-orm/core';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';
import { ProjectPermissionsService } from '../project-permissions/project-permissions.service';
import { NotificationsService } from '../../notifications/notifications.service';
import { InviteNotification } from './notifications/invite.notification';

@Injectable()
export class ProjectUsersService {
    constructor(
        @InjectRepository(Project)
        private projectsRepo: EntityRepository<Project>,
        @InjectRepository(ProjectUser)
        private repo: EntityRepository<ProjectUser>,
        private usersService: UsersService,
        @Inject(forwardRef(() => ProjectsService))
        private projectsService: ProjectsService,
        private projectPermissionsService: ProjectPermissionsService,
        private notificationService: NotificationsService,
    ) {
    }

    async getMany(dto: GetProjectUsersDto, currentUser: User) {
        await this.checkPermissions(ref(Project, dto.project), currentUser, ProjectPermissionType.ViewUsers);

        const [items, count] = await this.repo.findAndCount({ project: dto.project }, {
            populate: ['user.image'],
            limit: dto.limit,
            offset: dto.offset,
        });

        return { items, count };
    }

    async update(dto: UpdateProjectUserDto, currentUser: User) {
        const projectUser = await this.repo.findOneOrFail({
            user: dto.user,
            project: dto.project,
        }, { populate: ['permissions'] });
        await this.checkPermissions(projectUser.project, currentUser, ProjectPermissionType.EditPermissions);
        const permissions = this.projectPermissionsService.getMany({ id: dto.permissions });
        projectUser.permissions.set(permissions);
        await this.repo.getEntityManager().flush();
        return projectUser;
    }

    async invite(dto: InviteToProjectDto, currentUser: User) {
        await this.checkPermissions(ref(Project, dto.project), currentUser, ProjectPermissionType.EditUsers);
        const [user] = await this.usersService.getOrCreate({ email: dto.email });
        const item = this.repo.create({
            project: dto.project,
            role: dto.role,
            user,
            inviteUuid: uuid(),
        });
        await this.repo.getEntityManager().flush();
        this.notificationService.notify(item.user, new InviteNotification(item));
        return item;
    }

    async acceptInvite(dto: AcceptInviteToProjectDto, currentUser: User) {
        const item = await this.repo.findOneOrFail({
            user: currentUser,
            inviteUuid: dto.uuid,
        });
        item.inviteUuid = null;
        await this.repo.getEntityManager().flush();
        return item;
    }

    async join(dto: JoinProjectDto, currentUser: User) {
        let project: Project;
        try {
            project = await this.projectsRepo.findOneOrFail({ id: +dto.project });
        } catch (e) {
            throw createValidationException({ project: ['Проект не найден'] });
        }

        if (project.password === dto.password) {
            this.repo.create({
                project,
                user: currentUser,
                role: ProjectRole.Client,
            });
        } else if (project.protectedPassword === dto.password) {
            this.repo.create({
                project,
                user: currentUser,
                role: ProjectRole.Organizer,
            });
        } else {
            throw createValidationException({ password: ['Неверный пароль или проект'] });
        }
        await this.repo.getEntityManager().flush();
        return this.projectsService.get({ id: +dto.project }, currentUser);
    }

    async remove(dto: DeleteProjectUserDto, currentUser: User) {
        await this.repo.nativeDelete({ project: dto.project, user: dto.user });
        return this.getMany({ project: dto.project }, currentUser);
    }

    async checkPermissions(
        project: Ref<Project> | Project,
        user: Ref<User> | User,
        ...permissions: ProjectPermissionType[]
    ) {
        const userPivot = await this.repo.findOne({
            project,
            user,
        }, { populate: ['permissions', 'role'] });

        if (!userPivot) {
            throw new ForbiddenException();
        }

        if (userPivot.role === ProjectRole.Owner) {
            return;
        }

        const userPermissions = userPivot.permissions.getItems().map((p) => p.id);
        if (!permissions.every(p => userPermissions.includes(p))) {
            throw new ForbiddenException();
        }
    }
}
