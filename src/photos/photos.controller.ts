import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { PhotosService } from './photos.service';
import { DeletePhotoDto } from './dto/delete-photo.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetPhotoDto } from './dto/get-photo.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { StorePhotoDto } from './dto/store-photo.dto';
import { TakeUser } from '@1creator/backend';

@ApiTags('Photos')
@UseGuards(AuthGuard)
@Controller('photos')
export class PhotosController {
    constructor(private readonly service: PhotosService) {
    }

    @Post('/get')
    get(@Body() dto: GetPhotoDto, @TakeUser() user: User) {
        return this.service.get(dto, user, 'view');
    }

    // @Post('/getMany')
    // getMany(@Body() dto: GetPhotosDto, @TakeUser() user: User) {
    //     return this.service.getMany(dto, user);
    // }

    @Post('/store')
    store(@Body() dto: StorePhotoDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    // @Post('/storeBulk')
    // storeBulk(@Body() dto: StorePhotosDto, @TakeUser() user: User) {
    //     return this.service.storeBulk(dto);
    // }

    @Post('/remove')
    remove(@Body() dto: DeletePhotoDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
