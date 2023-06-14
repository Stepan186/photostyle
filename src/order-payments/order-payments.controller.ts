import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OrderPaymentsService } from './order-payments.service';
import { StoreOrderPaymentDto } from './dto/store-order-payment.dto';
import { TakeUser } from '@1creator/backend';
import { User } from '../users/entities/user.entity';
import { AuthGuard } from '../auth/guards/auth.guard';
import { GetOrderPaymentsDto } from './dto/get-order-payments.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Order payments')
@Controller('orderPayments')
export class OrderPaymentsController {
    constructor(
        private service: OrderPaymentsService,
    ) {
    }

    @UseGuards(AuthGuard)
    @Post('store')
    store(@Body() dto: StoreOrderPaymentDto, @TakeUser() user: User,
    ) {
        return this.service.store(dto, user);
    }

    @UseGuards(AuthGuard)
    @Post('getMany')
    getMany(@Body() dto: GetOrderPaymentsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }
}