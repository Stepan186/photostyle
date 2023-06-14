import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { IPaymentJob } from './interfaces/payment-job.interface';
import { Job, Queue } from 'bull';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PaymentStatus } from './entities/payment.entity';
import { PAYMENT_ONLINE_PROVIDER, PAYMENTS_QUEUE } from './constants';
import { Inject } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { PaymentStatusChanged } from './events';
import { AgentPayment } from '../agents/agent-payments/entities/agent-payment.entity';
import { IPaymentProvider } from './interfaces/payment-provider.interface';

@Processor(PAYMENTS_QUEUE)
export class PaymentsConsumer {
    constructor(
        @Inject(PAYMENT_ONLINE_PROVIDER)
        private paymentProvider: IPaymentProvider,
        @InjectRepository(AgentPayment)
        private repo: EntityRepository<AgentPayment>,
        private em2: EventEmitter2,
        private orm: MikroORM,
        @InjectQueue(PAYMENTS_QUEUE)
        private paymentsQueue: Queue<IPaymentJob>,
    ) {
    }

    @Process()
    @UseRequestContext()
    async process(job: Job<IPaymentJob>) {
        const payment = await this.repo.findOneOrFail(job.data.uuid);
        const status = await this.paymentProvider.getStatus(payment);
        if (payment.status != status) {
            this.repo.assign(payment, { status });
            await this.repo.getEntityManager().flush();

            this.em2.emit(PaymentStatusChanged.name, new PaymentStatusChanged().assign({
                payment: {
                    ...payment,
                    total: +payment.total,
                },
            }));
        }

        if (status === PaymentStatus.Failed || status === PaymentStatus.Succeeded || status === PaymentStatus.Refunded) {
            return;
        }
        throw new Error();
    }
}