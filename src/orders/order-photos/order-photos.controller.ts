import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { UpdateOrderPhotoDto } from './dto/update-order-photo.dto';
import { DeleteOrderPhotoDto } from './dto/delete-order-photo.dto';
import { OrderPhotosService } from './order-photos.service';

@ApiTags('Order photo')
@UseGuards(AuthGuard)
@Controller('orderPhotos')
export class OrderPhotosController {
    constructor(private readonly service: OrderPhotosService) {
    }

    @Post('/update')
    update(@Body() dto: UpdateOrderPhotoDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: DeleteOrderPhotoDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
