import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AgentPayment } from './entities/agent-payment.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../../users/entities/user.entity';
import { GetAgentPaymentsDto } from './dto/get-agent-payments.dto';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { PaymentsService } from '../../payments/payments.service';
import { PaymentStatus } from '../../payments/entities/payment.entity';
import { TopUpBalanceDto } from './dto/top-up-balance.dto';


@Injectable()
export class AgentPaymentsService {
    constructor(
        @InjectRepository(AgentPayment)
        private repo: EntityRepository<AgentPayment>,
        private paymentsService: PaymentsService,
    ) {
    }

    async store(dto: TopUpBalanceDto, currentUser: User) {
        const payment = await this.repo.create({
            ...dto,
            description: 'Пополнение баланса',
            user: currentUser,
            agent: currentUser.agent!,
            status: PaymentStatus.Created,
        });
        await this.repo.getEntityManager().flush();
        return await this.paymentsService.register(payment);
    }

    async getMany(dto: GetAgentPaymentsDto, currentUser: User) {
        const where: FilterQuery<AgentPayment> = {};

        if (!currentUser.isAgent) {
            where.agent = currentUser.agent;
        }

        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { createdAt: QueryOrder.DESC },
            populate: ['agent', 'user'],
        });
        return { items, count };
    }
}