import { Assignable } from '@1creator/common';
import { PaymentStatus, PaymentTableType } from './entities/payment.entity';

export class PaymentStatusChanged extends Assignable {
    payment: {
        uuid: string;
        table: PaymentTableType;
        total: number;
        status: PaymentStatus;
        agent?: { uuid: string };
    };
}