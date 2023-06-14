import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AgentFeaturesModule } from './agent-features/agent-features.module';
import { AgentTransactionsModule } from './agent-transactions/agent-transactions.module';
import { Agent } from './agents/entities/agent.entity';
import { AgentPaymentsModule } from './agent-payments/agent-payments.module';
import { AgentsController } from './agents/agents.controller';
import { AgentsService } from './agents/agents.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BalanceNotificationsService } from './agents/balance-notifications.service';


@Module({
    imports: [
        MikroOrmModule.forFeature([Agent]),
        AgentFeaturesModule,
        AgentPaymentsModule,
        AgentTransactionsModule,
        ScheduleModule.forRoot(),
    ],
    controllers: [AgentsController],
    providers: [AgentsService, BalanceNotificationsService],
    exports: [],
})

export class AgentsModule {
}