import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { TakeUser, UuidDto } from '@1creator/backend';
import { User } from '../../users/entities/user.entity';
import { StoreOrderDto } from './dto/store-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GetOrderDto } from './dto/get-order.dto';
import { OrdersService } from './orders.service';
import { GetOrdersDto } from './dto/get-orders.dto';

@ApiTags('Orders')
@UseGuards(AuthGuard)
@Controller('orders')
export class OrdersController {
    constructor(private readonly service: OrdersService) {
    }

    @Post('/getMany')
    getMany(@Body() dto: GetOrdersDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/get')
    get(@Body() dto: GetOrderDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreOrderDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateOrderDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: UuidDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
