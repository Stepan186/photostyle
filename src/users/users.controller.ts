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
import { AdminGuard } from '../auth/guards/admin.guard';
import { AgentGuard } from '../agents/guards/agent.guard';

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
    @UseGuards(AgentGuard)
    getMany(@Body() dto: GetUsersDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    @UseGuards(AdminGuard)
    store(@Body() dto: StoreUserDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    @UseGuards(AdminGuard)
    update(@Body() dto: UpdateUserDto, @TakeUser() user: User) {
        return this.service.update(dto.uuid, dto, user);
    }

    @Post('/remove')
    @UseGuards(AdminGuard)
    remove(@Body() dto: DeleteUserDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
