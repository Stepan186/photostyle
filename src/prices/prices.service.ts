import { Injectable } from '@nestjs/common';
import { GetPricesDto } from './dto/get-prices.dto';
import { UpdatePriceDto } from './dto/update-price.dto';
import { StorePriceDto } from './dto/store-price.dto';
import { DeletePriceDto } from './dto/delete-price.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { GetPriceDto } from './dto/get-price.dto';
import { User } from '../users/entities/user.entity';
import { PriceList } from './entities/price-list.entity';
import { ProjectPrice } from '../projects/projects/entities/project-price.entity';
import { Project } from '../projects/projects/entities/project.entity';

@Injectable()
export class PricesService {
    constructor(
        @InjectRepository(PriceList)
        private repo: EntityRepository<PriceList>,
        @InjectRepository(ProjectPrice)
        private projectPricesRepo: EntityRepository<ProjectPrice>,
    ) {
    }

    async getMany(dto: GetPricesDto, currentUser: User) {
        const where: FilterQuery<PriceList> = { user: currentUser };
        const [items, count] = await this.repo.findAndCount(where, {
            populate: ['items.examples'],
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { id: QueryOrder.DESC },
        });
        return { items, count };
    }

    async get(dto: GetPriceDto, currentUser: User) {
        const where: FilterQuery<PriceList> = { user: currentUser };

        if (dto.id) {
            where.id = dto.id;
        }

        return await this.repo.findOneOrFail(where, { populate: ['items.examples'] });
    }

    async store(dto: StorePriceDto, currentUser: User) {
        const item = this.repo.create({
            ...dto,
            user: currentUser,
        });
        await this.repo.getEntityManager().flush();
        await this.repo.populate(item, ['items.examples']);
        return item;
    }

    async update(
        dto: UpdatePriceDto,
        currentUser: User,
    ): Promise<PriceList> {
        const item = await this.get(dto, currentUser);
        item.assign(dto);
        await this.repo.getEntityManager().flush();

        await this.repo.populate(item, ['items.examples']);
        return item;
    }

    async remove(
        dto: DeletePriceDto,
        currentUser: User,
    ): Promise<PriceList> {
        const item = await this.get(dto, currentUser);
        await this.repo.getEntityManager().removeAndFlush(item);
        return item;
    }

    async getProjectActivePriceList(project: Project): Promise<PriceList> {
        const projectPrice = await this.projectPricesRepo.findOneOrFail({
            project,
            $or: [
                { expiresAt: { $gte: 'now()' } },
                { expiresAt: null },
            ],
        }, {
            orderBy: { expiresAt: QueryOrder.ASC_NULLS_LAST },
            populate: ['priceList.items'],
        });

        return projectPrice.priceList;
    }
}
