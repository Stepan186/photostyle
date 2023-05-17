import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AgentPayment } from './entities/agent-payment.entity';
import { AgentPaymentsService } from './agent-payments.service';
import { AgentPaymentsController } from './agent-payments.controller';

@Module({
    imports: [MikroOrmModule.forFeature([AgentPayment])],
    exports: [AgentPaymentsService],
    providers: [AgentPaymentsService],
    controllers: [AgentPaymentsController],
})

export class AgentPaymentsModule {
}