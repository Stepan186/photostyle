import { Inject, Injectable } from '@nestjs/common';
import { PAYMENT_ONLINE_PROVIDER, PAYMENTS_QUEUE } from './constants';
import { IPaymentProvider } from './interfaces/payment-provider.interface';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Payment, PaymentType } from './entities/payment.entity';
import { InvoiceService } from './invoice/invoice.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IPaymentJob } from './interfaces/payment-job.interface';
import { InjectRepository } from '@mikro-orm/nestjs';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { RefundPaymentDto } from './dto/refund-payment.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PaymentsService {
    providers: Partial<Record<PaymentType, IPaymentProvider>>;

    constructor(
        @Inject(PAYMENT_ONLINE_PROVIDER)
        private readonly onlineProvider: IPaymentProvider,
        @InjectRepository(Payment)
        private repo: EntityRepository<Payment>,
        private invoiceService: InvoiceService,
        @InjectQueue(PAYMENTS_QUEUE)
        private paymentsQueue: Queue<IPaymentJob>,
    ) {
        this.providers = {
            [PaymentType.Online]: onlineProvider,
            [PaymentType.Invoice]: invoiceService,
        };
    }

    async register(payment: Payment) {
        const providerResponse = await this.getProvider(payment.type).createPayment(payment, 'redirect');
        const payload: IPaymentJob = { uuid: payment.uuid };
        await this.paymentsQueue.add(payload, {
            attempts: 30,
            backoff: { type: 'fixed', delay: 10000 },
        });
        return providerResponse;
    }

    async getStatus(payment: Payment) {
        return await this.getProvider(payment.type).getStatus(payment);
    }

    async getMany(dto: GetPaymentsDto) {
        const where: FilterQuery<Payment> = {};
        if (dto.user) {
            where.user = dto.user;
        }
        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { createdAt: QueryOrder.DESC },
        });
        return { items, count };
    }

    async getJobCount() {
        return {
            active: await this.paymentsQueue.getActiveCount(),
            waiting: await this.paymentsQueue.getWaitingCount(),
            completed: await this.paymentsQueue.getCompletedCount(),
            paused: await this.paymentsQueue.getPausedCount(),
            failed: await this.paymentsQueue.getFailedCount(),
        };
    }

    async getFailedJobs() {
        return await this.paymentsQueue.getFailed();
    }

    getProvider(type: PaymentType) {
        const provider = this.providers[type];
        if (!provider) {
            throw new Error('provider not implemented');
        }
        return provider;
    }

    async refund(dto: RefundPaymentDto, currentUser: User) {
        // todo protect
        const payment = await this.repo.findOneOrFail({ uuid: dto.uuid });
        return await this.getProvider(payment.type).refund(payment);
    }
}