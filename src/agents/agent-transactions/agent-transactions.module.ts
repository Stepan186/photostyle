import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AgentTransaction } from './entity/agent-transaction.entity';
import { AgentTransactionsService } from './agent-transactions.service';
import { AgentTransactionsController } from './agent-transactions.controller';

@Module({
    imports: [MikroOrmModule.forFeature([AgentTransaction])],
    providers: [AgentTransactionsService],
    controllers: [AgentTransactionsController],
    exports: [AgentTransactionsService],
})

export class AgentTransactionsModule {
}