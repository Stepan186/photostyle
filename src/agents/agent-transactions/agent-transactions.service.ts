import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AgentTransaction } from './entity/agent-transaction.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { User } from '../../users/entities/user.entity';
import { GetAgentTransactionsDto } from './dto/get-agent-transactions.dto';
import { StoreAgentTransactionDto } from './dto/store-agent-transaction.dto';
import { Agent } from '../agents/entities/agent.entity';
import { ref, Ref } from '@mikro-orm/core';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentStatusChanged } from '../../payments/events';
import { PaymentStatus, PaymentTableType } from '../../payments/entities/payment.entity';
import { AgentPayment } from '../agent-payments/entities/agent-payment.entity';

@Injectable()
export class AgentTransactionsService {
    constructor(
        @InjectRepository(AgentTransaction)
        private repo: EntityRepository<AgentTransaction>,
        @InjectRepository(AgentPayment)
        private agentPaymentRepo: EntityRepository<AgentPayment>,
    ) {
    }

    async store(dto: StoreAgentTransactionDto) {
        const agentRef = ref(Agent, dto.agent);
        const currentBalance = await this.getBalance(agentRef);

        if (dto.change < 0 && currentBalance < Math.abs(dto.change)) {
            throw new BadRequestException('Недостаточно средств на балансе аккаунта');
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
        const lastTransaction = await this.getLastTransaction(agent);

        return +(lastTransaction?.balance ?? 0);
    }

    async getMany(dto: GetAgentTransactionsDto, _currentUser: User) {
        const [items, count] = await this.repo.findAndCount(
            { agent: dto.agent },
            {
                orderBy: [{ createdAt: 'DESC' }],
                fields: ['description', 'change', 'createdAt', 'agent', 'balance'],
                limit: dto.limit,
                offset: dto.offset,
            });
        return { items, count };
    }

    async getLastTransaction(agent: Ref<Agent>) {
        return await this.repo.findOne({ agent }, { orderBy: { createdAt: 'DESC' } });
    }

    @OnEvent(PaymentStatusChanged.name)
    async onPaymentStatusChanged({ payment }: PaymentStatusChanged) {
        if (payment.status === PaymentStatus.Succeeded && payment.table === PaymentTableType.Agent && payment.agent?.uuid) {
            await this.store({
                change: payment.total,
                description: 'Пополнение баланса',
                agentPayment: payment.uuid,
                agent: payment.agent.uuid,
            });
        }
    }
}