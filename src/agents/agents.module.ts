import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AgentFeaturesModule } from './agent-features/agent-features.module';
// import { AgentPaymentsModule } from './agent-payments/agent-payments.module';
import { AgentTransactionsModule } from './agent-transactions/agent-transactions.module';
import { Agent } from './agents/entities/agent.entity';


@Module({
    imports: [
        MikroOrmModule.forFeature([Agent]),
        AgentFeaturesModule,
        // AgentPaymentsModule,
        AgentTransactionsModule,
    ],
    exports: [],
    providers: [],
    controllers: [],
})

export class AgentsModule {
}