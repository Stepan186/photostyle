import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PricesService } from './prices.service';
import { UpdatePriceDto } from './dto/update-price.dto';
import { StorePriceDto } from './dto/store-price.dto';
import { GetPricesDto } from './dto/get-prices.dto';
import { DeletePriceDto } from './dto/delete-price.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetPriceDto } from './dto/get-price.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TakeUser } from '@1creator/backend';

@ApiTags('Price lists')
@UseGuards(AuthGuard)
@Controller('prices')
export class PricesController {
    constructor(private readonly service: PricesService) {
    }

    @Post('/get')
    get(@Body() dto: GetPriceDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetPricesDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StorePriceDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdatePriceDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }


    @Post('/remove')
    remove(@Body() dto: DeletePriceDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
