import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AgentPayment } from './entities/agent-payment.entity';
import { AgentPaymentsService } from './agent-payments.service';
import { AgentPaymentsController } from './agent-payments.controller';
import { PaymentsModule } from '../../payments/payments.module';

@Module({
    imports: [MikroOrmModule.forFeature([AgentPayment]), PaymentsModule],
    providers: [AgentPaymentsService],
    controllers: [AgentPaymentsController],
    exports: [AgentPaymentsService],
})

export class AgentPaymentsModule {
}