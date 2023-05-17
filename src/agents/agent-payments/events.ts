import { Assignable } from '@1creator/common';
import { Payment } from '../../payments/entities/payment.entity';

export class AgentPaymentSucceeded extends Assignable {
    payment: Payment;
}