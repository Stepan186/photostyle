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

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User) private repo: EntityRepository<User>,
        private readonly cryptoService: CryptoService,
        // private readonly cartService: CartService,
    ) {
    }

    async getMany(dto: GetUsersDto) {
        const where: FilterQuery<User> = {};
        if (dto.uuid) {
            where.uuid = { $in: dto.uuid };
        }
        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
        });
        return { items, count };
    }

    async get(dto: GetUserDto) {
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

    async isExists(dto: GetUserDto) {
        try {
            await this.get(dto);
            return true;
        } catch (e) {
            return false;
        }
    }

    async store(dto: StoreUserDto, _currentUser?: User): Promise<User> {
        if (dto.password) {
            dto.password = await this.cryptoService.bcrypt(dto.password);
        }
        const item = this.repo.create(dto);

        if (dto.isAgent) {
            item.agent = new Agent();
        }

        await this.repo.getEntityManager().persistAndFlush(item);

        // if (!dto.isAgent) {
        //     await this.cartService.store(item);
        // }
        return item;
    }

    async update(
        uuid: string,
        dto: UpdateUserDto,
        currentUser: User,
    ): Promise<User> {
        if (dto.password) {
            dto.password = await this.cryptoService.bcrypt(dto.password);
        }
        await this.repo.nativeUpdate(uuid, dto);
        return this.get({ uuid });
    }

    async remove(dto: DeleteUserDto, currentUser: User): Promise<User> {
        const item = await this.get({ uuid: dto.uuid });
        await this.repo.remove(item);
        return item;
    }
}
