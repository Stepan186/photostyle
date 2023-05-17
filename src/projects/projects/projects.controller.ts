import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { StoreProjectDto } from './dto/store-project.dto';
import { GetProjectDto } from './dto/get-project.dto';
import { GetProjectsDto } from './dto/get-projects.dto';
import { DeleteProjectDto } from './dto/delete-project.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateProjectDto } from './dto/update-project.dto';
import { User } from '../../users/entities/user.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { TakeUser } from '@1creator/backend';
import { JoinProjectDto } from './dto/join-project.dto';
import { ProjectUsersService } from '../project-users/project-users.service';

@ApiTags('Projects')
@UseGuards(AuthGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly service: ProjectsService,
                private projectUsersService: ProjectUsersService) {
    }

    @Post('/get')
    get(@Body() dto: GetProjectDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/addFavorite')
    addFavorite(@Body() dto: GetProjectDto, @TakeUser() user: User) {
        return this.service.addFavorite(dto, user);
    }

    @Post('/removeFavorite')
    removeFavorite(@Body() dto: GetProjectDto, @TakeUser() user: User) {
        return this.service.removeFavorite(dto, user);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetProjectsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreProjectDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/archive')
    archive(@Body() dto: GetProjectDto, @TakeUser() user: User) {
        return this.service.archive(dto, user);
    }

    @Post('/unArchive')
    unArchive(@Body() dto: GetProjectDto, @TakeUser() user: User) {
        return this.service.unArchive(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateProjectDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: DeleteProjectDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }

    @Post('/refreshPassword')
    refreshPassword(@Body() dto: GetProjectDto, @TakeUser() user: User) {
        return this.service.refreshPassword(dto, user);
    }

    @Post('/join')
    join(@Body() dto: JoinProjectDto, @TakeUser() user: User) {
        return this.projectUsersService.join(dto, user);
    }
}
