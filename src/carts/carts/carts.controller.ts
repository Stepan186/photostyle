import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { TakeUser } from '@1creator/backend';
import { User } from '../../users/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { CartsService } from './carts.service';
import { GetCartDto } from './dto/get-cart.dto';
import { StoreCartDto } from './dto/store-cart.dto';

@ApiTags('Carts')
@UseGuards(AuthGuard)
@Controller('carts')
export class CartsController {
    constructor(private readonly service: CartsService) {
    }

    @Post('/get')
    get(@Body() dto: GetCartDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreCartDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateCartDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }
}
