import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { DirectoriesService } from './directories.service';
import { UpdateDirectoryDto } from './dto/update-directory.dto';
import { StoreDirectoryDto } from './dto/store-directory.dto';
import { GetDirectoriesDto } from './dto/get-directories.dto';
import { DeleteDirectoryDto } from './dto/delete-directory.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { GetDirectoryDto } from './dto/get-directory.dto';
import { AuthGuard } from '../auth/guards/auth.guard';
import { TakeUser } from '@1creator/backend';

@ApiTags('Directories')
@UseGuards(AuthGuard)
@Controller('directories')
export class DirectoriesController {
    constructor(private readonly service: DirectoriesService) {
    }

    @Post('/get')
    get(@Body() dto: GetDirectoryDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetDirectoriesDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreDirectoryDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateDirectoryDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }


    @Post('/remove')
    remove(@Body() dto: DeleteDirectoryDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
