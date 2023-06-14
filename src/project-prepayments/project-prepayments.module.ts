import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectPrepayment } from "./entities/project-prepayment.entity";
import { ProjectPrepaymentsService } from "./project-prepayments.service";
import { ProjectPrepaymentsController } from "./project-prepayments.controller";
import { PaymentsModule } from "../payments/payments.module";
import { OrdersModule } from "../orders/orders.module";

@Module({
    imports: [MikroOrmModule.forFeature([ProjectPrepayment]), PaymentsModule, OrdersModule],
    controllers: [ProjectPrepaymentsController],
    providers: [ProjectPrepaymentsService],
    exports: [],
})
export class ProjectPrepaymentsModule {
}
