import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../../users/entities/user.entity';
import { FilterQuery, QueryOrder, ref } from '@mikro-orm/core';
import { PaginationDto, UuidDto } from '@1creator/backend';
import { Agent } from './entities/agent.entity';
import { UpdateAgentDto } from '../../users/dto/update-agent.dto';
import { AgentTransactionsService } from '../agent-transactions/agent-transactions.service';

export class AgentsService {
    constructor(
        @InjectRepository(Agent)
        private repo: EntityRepository<Agent>,
        private agentTransactionsService: AgentTransactionsService,
    ) {
    }

    async getMany(dto: PaginationDto, currentUser: User) {
        const where: FilterQuery<Agent> = {};
        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { createdAt: QueryOrder.DESC },
        });

        return { items, count };
    }

    async get(dto: UuidDto, currentUser: User): Promise<Agent> {
        const where: FilterQuery<Agent> = {};

        if (dto.uuid) {
            where.uuid = dto.uuid;
        }

        const res = await this.repo.findOneOrFail(where, { populate: [] });
        res.balance = await this.agentTransactionsService.getBalance(res.toReference());

        return res;
    }

    async update(
        dto: UpdateAgentDto & UuidDto,
        currentUser: User,
    ): Promise<Agent> {
        const agent = await this.get({ uuid: dto.uuid }, currentUser);
        agent.assign(dto);
        await this.repo.getEntityManager().flush();

        return await this.get(dto, currentUser);
    }

    async remove(
        dto: UuidDto,
        currentUser: User,
    ): Promise<Agent> {
        const order = await this.get({ uuid: dto.uuid }, currentUser);
        await this.repo.getEntityManager().removeAndFlush(order);
        return order;
    }


}