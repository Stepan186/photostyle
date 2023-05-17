import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AgentTransaction } from './entity/agent-transaction.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../../users/entities/user.entity';
import { GetAgentTransactionsDto } from './dto/get-agent-transactions.dto';
import { StoreAgentTransactionDto } from './dto/store-agent-transaction.dto';
import { Agent } from "../agents/entities/agent.entity";
import { ref, Ref } from "@mikro-orm/core";


@Injectable()
export class AgentTransactionsService {
    constructor(
        @InjectRepository(AgentTransaction)
        private repo: EntityRepository<AgentTransaction>,
    ) {
    }

    async store(dto: StoreAgentTransactionDto) {
        const agentRef = ref(Agent, dto.agent);
        const currentBalance = await this.getBalance(agentRef);

        if (dto.change < 0 && currentBalance < Math.abs(dto.change)) {
            throw new BadRequestException('Недостаточно денег на вашем балансе');
        }

        const agentTransaction = this.repo.create({
            ...dto,
            balance: currentBalance + dto.change,
            agent: agentRef,
        });
        await this.repo.getEntityManager().flush();
        return agentTransaction;
    }

    async getBalance(agent: Ref<Agent>) {
        const lastTransaction = await this.repo.findOne(
            { agent },
            { orderBy: [{ createdAt: 'DESC' }] },
        );

        return +(lastTransaction?.balance ?? 0);
    }

    async getMany(dto: GetAgentTransactionsDto, currentUser: User) {
        const [items, count] = await this.repo.findAndCount(
            { agent: dto.agent },
            {
                orderBy: [{ createdAt: 'DESC' }],
                fields: ['description', 'change', 'createdAt'],
                limit: dto.limit,
                offset: dto.offset,
            });
        return { items, count };
    }
}