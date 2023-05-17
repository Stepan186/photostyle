import { Injectable } from '@nestjs/common';
import { GetPricesDto } from './dto/get-prices.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery } from '@mikro-orm/core';
import { User } from '../users/entities/user.entity';
import { PriceItem } from './entities/price-item.entity';
import { GetPriceItemsDto } from "./dto/get-price-items.dto";

@Injectable()
export class PriceItemsService {
    constructor(
        @InjectRepository(PriceItem)
        private repo: EntityRepository<PriceItem>,
    ) {
    }

    async getMany(dto: GetPriceItemsDto, currentUser: User) {
        const where: FilterQuery<PriceItem> = { list: { user: currentUser } };
        if (dto.id) {
            where.id = dto.id;
        }
        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
        });
        return { items, count };
    }
}
