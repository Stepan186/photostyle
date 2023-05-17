import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { UpdateCartPhotoDto } from './dto/update-cart-photo.dto';
import { DeleteCartPhotoDto } from './dto/delete-cart-photo.dto';
import { CartPhotosService } from './cart-photos.service';

@ApiTags('Cart photo')
@UseGuards(AuthGuard)
@Controller('cartPhotos')
export class CartPhotosController {
    constructor(private readonly service: CartPhotosService) {
    }

    @Post('/update')
    update(@Body() dto: UpdateCartPhotoDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: DeleteCartPhotoDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
