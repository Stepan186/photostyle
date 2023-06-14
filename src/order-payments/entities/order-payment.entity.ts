import { Payment, PaymentTableType } from '../../payments/entities/payment.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Order } from '../../orders/order/entities/order.entity';

@Entity({ discriminatorValue: PaymentTableType.Order })
export class OrderPayment extends Payment {
    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    fee: string | number;

    @ManyToOne(() => Order)
    order: Order;
}