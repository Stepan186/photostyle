import { ApiTags } from '@nestjs/swagger';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PaginationDto, TakeUser } from '@1creator/backend';
import { User } from '../users/entities/user.entity';
import { UnloadingsService } from './unloadings.service';
import { StoreUnloadingDto } from './dto/store-unloading.dto';


@ApiTags('Unloading')
@UseGuards(AuthGuard)
@Controller('unloadings')
export class UnloadingsController {
    constructor(
        private readonly service: UnloadingsService,
    ) {
    }

    @Post('/getMany')
    getMany(@Body() dto: PaginationDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreUnloadingDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

}
