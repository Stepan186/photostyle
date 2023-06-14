import { Module } from '@nestjs/common';
import { AgentFeaturesController } from './agent-features.controller';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Feature } from './entites/feature.entity';
import { AgentFeaturesService } from './agent-features.service';
import { AgentFeature } from './entites/agent-feature.entity';
import { AgentTransactionsModule } from '../agent-transactions/agent-transactions.module';
import { FeaturesService } from './features.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([Feature, AgentFeature]),
        AgentTransactionsModule,
    ],
    exports: [AgentFeaturesService],
    providers: [AgentFeaturesService, FeaturesService],
    controllers: [AgentFeaturesController],
})

export class AgentFeaturesModule {
}