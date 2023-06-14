import { Module } from '@nestjs/common';
import { AlfaBankService } from './alfabank/alfabank.service';
import { PaymentsService } from './payments.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Payment } from './entities/payment.entity';
import { PAYMENT_ONLINE_PROVIDER, PAYMENTS_QUEUE } from './constants';
import { InvoiceService } from './invoice/invoice.service';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { PaymentsController } from './payments.controller';
import { PaymentsConsumer } from './payments.consumer';
import { AgentPayment } from '../agents/agent-payments/entities/agent-payment.entity';

@Module({
    imports: [
        MikroOrmModule.forFeature([Payment, AgentPayment]),
        BullModule.registerQueue({ name: PAYMENTS_QUEUE }),
        HttpModule,
    ],
    controllers: [PaymentsController],
    providers: [
        PaymentsService,
        InvoiceService,
        {
            useClass: AlfaBankService,
            provide: PAYMENT_ONLINE_PROVIDER,
        },
        PaymentsConsumer,
    ],
    exports: [PaymentsService],
})

export class PaymentsModule {
}