import { Injectable } from '@nestjs/common';
import { GetClientsDto } from './dto/get-clients.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery } from '@mikro-orm/core';
import { GetClientDto } from './dto/get-client.dto';
import { User } from '../users/entities/user.entity';
import { ProjectUser } from '../projects/project-users/entities/project-user.entity';
import { ProjectRole } from '../projects/project-users/entities/project-role.enum';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(User)
        private usersRepo: EntityRepository<User>,
        @InjectRepository(ProjectUser)
        private projectUsersRepo: EntityRepository<ProjectUser>,
    ) {
    }

    async getMany(dto: GetClientsDto, currentUser: User) {
        const projects = (await this.projectUsersRepo.find({
            user: currentUser,
            role: [ProjectRole.Owner, ProjectRole.Employee],
        }, { fields: ['project'] })).map(i => i.project);

        const where: FilterQuery<User> = { projectsPivot: { project: projects } };

        if (dto.search) {
            where.$and = [
                {
                    $or: [
                        { lastName: { $ilike: `%${dto.search}%` } },
                        { email: { $ilike: `%${dto.search}%` } },
                        { phone: { $ilike: `%${dto.search}%` } },
                    ],
                },
            ];
        }

        const [items, count] = await this.usersRepo.findAndCount(where, {
            populate: ['orders'],
            populateWhere: { orders: { project: projects } },
            limit: dto.limit,
            offset: dto.offset,
        });
        return { items, count };
    }

    async get(dto: GetClientDto, _currentUser: User) {
        const where: FilterQuery<User> = {};

        if (dto.uuid) {
            where.uuid = dto.uuid;
        }

        return await this.usersRepo.findOneOrFail(where, { populate: [] });
    }
}
