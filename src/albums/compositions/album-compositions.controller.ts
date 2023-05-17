import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { User } from '../../users/entities/user.entity';
import { AlbumCompositionsService } from './album-compositions.service';
import { SetRegionPhotoDto } from './dto/set-region-photo.dto';
import { GetAlbumCompositionDto } from './dto/get-album-composition.dto';
import { PaidPageDto } from './dto/paid-page.dto';

@ApiTags('Album composition')
@UseGuards(AuthGuard)
@Controller('albumCompositions')
export class AlbumCompositionsController {
    constructor(
        private readonly service: AlbumCompositionsService,
    ) {
    }

    @Post('/get')
    get(@Body() dto: GetAlbumCompositionDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/setRegionPhoto')
    setRegionPhoto(@Body() dto: SetRegionPhotoDto, @TakeUser() user: User) {
        return this.service.setRegionPhoto(dto, user);
    }

    @Post('/addPaidPage')
    addPaidPage(@Body() dto: PaidPageDto, @TakeUser() user: User) {
        return this.service.addPaidPage(dto, user);
    }

    @Post('/removePaidPage')
    removePaidPage(@Body() dto: PaidPageDto, @TakeUser() user: User) {
        return this.service.removePaidPage(dto, user);
    }
}
