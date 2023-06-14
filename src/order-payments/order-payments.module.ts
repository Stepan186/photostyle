import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrderPayment } from './entities/order-payment.entity';
import { PaymentsModule } from '../payments/payments.module';
import { OrderPaymentsService } from './order-payments.service';
import { OrderPaymentsController } from './order-payments.controller';
import { OrdersModule } from '../orders/orders.module';

@Module({
    imports: [MikroOrmModule.forFeature([OrderPayment]), PaymentsModule, OrdersModule],
    providers: [OrderPaymentsService],
    controllers: [OrderPaymentsController],
    exports: [],
})

export class OrderPaymentsModule {
}