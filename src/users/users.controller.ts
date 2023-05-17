import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { StoreUserDto } from './dto/store-user.dto';
import { GetUserDto } from './dto/get-user.dto';
import { GetUsersDto } from './dto/get-users.dto';
import { DeleteUserDto } from './dto/delete-user.dto';
import { User } from './entities/user.entity';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from '../auth/guards/auth.guard';

@ApiTags('Users')
@Controller('users')
export class UsersController {
    constructor(private readonly service: UsersService) {
    }

    @Post('/get')
    get(@Body() dto: GetUserDto) {
        return this.service.get(dto);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetUsersDto) {
        return this.service.getMany(dto);
    }

    @Post('/store')
    @UseGuards(AuthGuard)
    store(@Body() dto: StoreUserDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    @UseGuards(AuthGuard)
    update(@Body() dto: UpdateUserDto, @TakeUser() user: User) {
        return this.service.update(dto.uuid, dto, user);
    }

    @Post('/remove')
    @UseGuards(AuthGuard)
    remove(@Body() dto: DeleteUserDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
