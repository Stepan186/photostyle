import { Cron } from '@nestjs/schedule';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { Agent } from './entities/agent.entity';
import dayjs from 'dayjs';
import { LowBalanceNotification } from './notification/low-balance.notification';
import { AgentTransactionsService } from '../agent-transactions/agent-transactions.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { NotificationsService } from '../../notifications/notifications.service';
import { Injectable } from '@nestjs/common';
import { IsOverBalanceNotification } from './notification/is-over-balance.notification';

@Injectable()
export class BalanceNotificationsService {
    constructor(
        private agentTransactionService: AgentTransactionsService,
        @InjectRepository(Agent)
        private repo: EntityRepository<Agent>,
        private notificationService: NotificationsService,
        private orm: MikroORM,
    ) {
    }


    @Cron('*/60 * * * * *')
    @UseRequestContext()
    async sendLowBalanceNotifications() {
        const agents = await this.repo.findAll({ populate: ['features', 'users'] });
        for (const agent of agents) {
            const agentBalance = await this.agentTransactionService.getBalance(agent.toReference());
            const daysLeft = Math.floor(agentBalance / agent.dailyCost);
            if (daysLeft > 0 && daysLeft <= 5) {
                agent.users.getItems().forEach(u => {
                    this.notificationService.notify(u, new LowBalanceNotification(u, daysLeft));
                });
            } else if (daysLeft === 0) {
                const lastTransaction = await this.agentTransactionService.getLastTransaction(agent.toReference());
                if (!lastTransaction) {
                    continue;
                }
                const isLastTransactionRecently = dayjs(lastTransaction.createdAt).add(1, 'day').isAfter();
                if (isLastTransactionRecently) {
                    agent.users.getItems().forEach(u => {
                        this.notificationService.notify(u, new IsOverBalanceNotification(u));
                    });
                }
            }
        }
    }
}