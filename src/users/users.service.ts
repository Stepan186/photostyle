import { Injectable } from '@nestjs/common';
import { GetUsersDto } from './dto/get-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { StoreUserDto } from './dto/store-user.dto';
import { CryptoService } from '../auth/auth/crypto.service';
import { DeleteUserDto } from './dto/delete-user.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from './entities/user.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery } from '@mikro-orm/core';
import { Agent } from '../agents/agents/entities/agent.entity';
import { createValidationException } from '@1creator/backend';
import { ProjectRole } from '../projects/project-users/entities/project-role.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: EntityRepository<User>,
        private readonly cryptoService: CryptoService,
    ) {
    }

    async getMany(dto: GetUsersDto, currentUser: User) {
        const where: FilterQuery<User> = {};
        const populate: string[] = [];

        if (dto.uuid) {
            where.uuid = { $in: dto.uuid };
        }

        if (!currentUser.isAdmin) {
            where.projectsPivot = {
                project: {
                    usersPivot: {
                        role: [ProjectRole.Owner, ProjectRole.Employee, ProjectRole.Organizer],
                        user: currentUser,
                    },
                },
            };
        }

        if (dto.relations?.includes('orders')) {
            populate.push('orders');
        }

        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            populate: populate as never[],
        });
        return { items, count };
    }

    async get(dto: GetUserDto) {
        //todo protect
        return await this.repo.findOneOrFail(dto);
    }

    async getOrCreate(dto: { email: string }, data?: Partial<User>): Promise<[User, boolean]> {
        const where: FilterQuery<User> = { email: dto.email };
        try {
            return [await this.repo.findOneOrFail(where), false];
        } catch (e) {
            const item = this.repo.create({ email: dto.email, ...data });
            await this.repo.getEntityManager().flush();
            return [item, true];
        }
    }

    async isExists(dto: GetUserDto, exceptUuid?: string) {
        try {
            const where: FilterQuery<User> = dto;
            if (exceptUuid) {
                where.uuid = { $ne: exceptUuid };
            }
            await this.repo.findOneOrFail(where);
            return true;
        } catch (e) {
            return false;
        }
    }

    async store(dto: StoreUserDto, _currentUser?: User): Promise<User> {
        if (await this.isExists({ email: dto.email })) {
            throw createValidationException({ email: ['Данный электронный адрес уже занят'] });
        }

        if (dto.password) {
            dto.password = await this.cryptoService.bcrypt(dto.password);
        }
        const item = this.repo.create(dto);

        if (dto.isAgent) {
            item.agent = new Agent();
        }

        await this.repo.getEntityManager().persistAndFlush(item);

        return item;
    }

    async update(
        uuid: string,
        dto: UpdateUserDto,
        _currentUser: User,
    ): Promise<User> {
        if (dto.email && await this.isExists({ email: dto.email }, uuid)) {
            throw createValidationException({ email: ['Данный электронный адрес уже занят'] });
        }

        if (dto.password) {
            dto.password = await this.cryptoService.bcrypt(dto.password);
        }
        await this.repo.nativeUpdate(uuid, dto);
        return this.get({ uuid });
    }

    async remove(dto: DeleteUserDto, currentUser: User): Promise<User> {
        const item = await this.get({ uuid: dto.uuid });
        await this.repo.getEntityManager().remove(item);
        return item;
    }
}
