import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { ProjectUsersService } from './project-users.service';
import { DeleteProjectUserDto } from './dto/delete-project-user.dto';
import { GetProjectUsersDto } from './dto/get-project-users.dto';
import { StoreProjectUserDto } from './dto/store-project-user.dto';
import { TakeUser } from '@1creator/backend';
import { InviteToProjectDto } from './dto/invite-to-project.dto';
import { AcceptInviteToProjectDto } from './dto/accept-invite-to-project.dto';
import { UpdateProjectUserDto } from './dto/update-project-user.dto';

@ApiTags('Projects Users')
@UseGuards(AuthGuard)
@Controller('projectUsers')
export class ProjectUsersController {
    constructor(private readonly service: ProjectUsersService) {
    }

    @Post('/getMany')
    getMany(@Body() dto: GetProjectUsersDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: DeleteProjectUserDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }

    @Post('/invite')
    invite(@Body() dto: InviteToProjectDto, @TakeUser() user: User) {
        return this.service.invite(dto, user);
    }

    @Post('/acceptInvite')
    acceptInvite(@Body() dto: AcceptInviteToProjectDto, @TakeUser() user: User) {
        return this.service.acceptInvite(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateProjectUserDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }
}
