import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OrderPayment } from './entities/order-payment.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { PaymentsService } from '../payments/payments.service';
import { StoreOrderPaymentDto } from './dto/store-order-payment.dto';
import { User } from '../users/entities/user.entity';
import { OrdersService } from '../orders/order/orders.service';
import { PaymentStatus } from '../payments/entities/payment.entity';
import { ObjectQuery, QueryOrder } from '@mikro-orm/core';
import { GetOrderPaymentsDto } from './dto/get-order-payments.dto';
import { ProjectRole } from "../projects/project-users/entities/project-role.enum";

@Injectable()
export class OrderPaymentsService {
    constructor(
        @InjectRepository(OrderPayment)
        private repo: EntityRepository<OrderPayment>,
        private paymentsService: PaymentsService,
        private ordersService: OrdersService,
    ) {
    }

    async store(dto: StoreOrderPaymentDto, currentUser: User) {
        const order = await this.ordersService.get({ uuid: dto.order }, currentUser);
        const agent = await this.ordersService.getOrderAgent(order.toReference());

        if (!agent) {
            throw  new Error('Агент не найден');
        }

        const payment = this.repo.create({
            ...dto,
            user: currentUser,
            description: `Оплата заказа ${order.id}`,
            status: PaymentStatus.Created,
            fee: agent.fee * +order.total / 100,
            total: +order.total,
        });
        await this.repo.getEntityManager().flush();
        return await this.paymentsService.register(payment);
    }

    async getMany(dto: GetOrderPaymentsDto, currentUser: User) {
        const qb = this.repo.qb()
            .limit(dto.limit)
            .offset(dto.offset)
            .orderBy({createdAt:QueryOrder.DESC})
            .select(['order', 'description', 'paidAt', 'status', 'total', 'fee', 'createdAt', 'user'])
            .leftJoinAndSelect('order', 'order');

        if (dto.order) {
            qb.where({order: dto.order});
        }

        if (!currentUser.isAdmin) {
            if (currentUser.isAgent) {
                qb.where({
                    order:{
                        project:{
                            usersPivot:{
                                role:[ProjectRole.Owner,ProjectRole.Employee],
                                user:currentUser,
                            },
                        },
                    },
                });
            } else {
                qb.where({user:currentUser});
            }
        }

        const [items, count] = await qb.getResultAndCount();
        return { items, count };
    }
}