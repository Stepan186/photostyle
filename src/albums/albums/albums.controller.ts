import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AlbumsService } from './albums.service';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { StoreAlbumDto } from './dto/store-album.dto';
import { DeleteAlbumDto } from './dto/delete-album.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { PaginationDto, TakeUser } from '@1creator/backend';
import { GetAlbumDto } from './dto/get-album.dto';
import { GetAlbumsDto } from './dto/get-albums.dto';
import { SetAlbumRegionPhotoDto } from './dto/set-album-region-photo.dto';
import { Album } from './entities/album.entity';

@ApiTags('Albums')
@UseGuards(AuthGuard)
@Controller('albums')
export class AlbumsController {
    constructor(private readonly service: AlbumsService) {
    }

    @Post('/get')
    get(@Body() dto: GetAlbumDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetAlbumsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/getTemplates')
    getTemplates(@Body() dto: PaginationDto, @TakeUser() user: User) {
        return this.service.getTemplates(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreAlbumDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateAlbumDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }


    @Post('/remove')
    remove(@Body() dto: DeleteAlbumDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }

    @Post('/setRegionPhoto')
    setAlbumProtectedRegionPhoto(@Body() dto: SetAlbumRegionPhotoDto, @TakeUser() user: User): Promise<Album> {
        return this.service.setAlbumProtectedRegionPhoto(dto, user);
    }

}
