import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { StoreCartAlbumDto } from './dto/store-cart-album.dto';
import { UpdateCartAlbumDto } from './dto/update-cart-album.dto';
import { CartAlbumsService } from './cart-albums.service';
import { DeleteCartAlbumDto } from './dto/delete-cart-album.dto';

@ApiTags('Cart albums')
@UseGuards(AuthGuard)
@Controller('cartAlbums')
export class CartAlbumsController {
    constructor(
        private readonly service: CartAlbumsService,
    ) {
    }

    @Post('/store')
    store(@Body() dto: StoreCartAlbumDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateCartAlbumDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: DeleteCartAlbumDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
