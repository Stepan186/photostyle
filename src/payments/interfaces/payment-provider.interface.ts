import { Payment, PaymentStatus } from '../entities/payment.entity';

export type PaymentMethod = 'iframe' | 'redirect';

export interface IPaymentProvider {
    getStatus(payment: Payment): Promise<PaymentStatus>;

    createPayment(payment: Payment, method: PaymentMethod): Promise<{ url?: string }>;

    refund(payment: Payment);
}