import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AgentPayment } from './entities/agent-payment.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { OnEvent } from '@nestjs/event-emitter';
import { PaymentStatus } from '../../payments/entities/payment.entity';
import { AgentPaymentSucceeded } from './events';

@Injectable()
export class AgentPaymentsService {
    constructor(
        @InjectRepository(AgentPayment)
        private repo: EntityRepository<AgentPayment>,
    ) {
    }

    async test() {
        this.repo.find({});
    }

    @OnEvent('payment.succeeded')
    async onPaymentSucceeded({ payment }: AgentPaymentSucceeded) {
        const agentPayment = await this.repo.findOneOrFail({ uuid: payment.uuid });
        agentPayment.assign({ status: PaymentStatus.Succeeded });
        await this.repo.getEntityManager().flush();
        return agentPayment;
    }

    // todo getmany pagination
}