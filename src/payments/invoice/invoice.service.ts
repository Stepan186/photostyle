import { Payment, PaymentStatus } from '../entities/payment.entity';
import { Injectable } from '@nestjs/common';
import { IPaymentProvider, PaymentMethod } from '../interfaces/payment-provider.interface';

@Injectable()
export class InvoiceService implements IPaymentProvider {
    createPayment(payment: Payment, method: PaymentMethod): Promise<{ url: string }> {
        throw new Error('not implemented');
    }

    getStatus(payment: Payment): Promise<PaymentStatus> {
        return Promise.resolve(payment.status);
    }

    refund(payment: Payment) {
    }
}