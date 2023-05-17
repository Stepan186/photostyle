import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { StoreOrderAlbumDto } from './dto/store-order-album.dto';
import { UpdateOrderAlbumDto } from './dto/update-order-album.dto';
import { OrderAlbumsService } from './order-albums.service';
import { DeleteOrderAlbumDto } from './dto/delete-order-album.dto';

@ApiTags('Order albums')
@UseGuards(AuthGuard)
@Controller('orderAlbums')
export class OrderAlbumsController {
    constructor(
        private readonly service: OrderAlbumsService,
    ) {
    }

    @Post('/store')
    store(@Body() dto: StoreOrderAlbumDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateOrderAlbumDto, @TakeUser() user: User) {
        return this.service.update(dto.id, dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: DeleteOrderAlbumDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
