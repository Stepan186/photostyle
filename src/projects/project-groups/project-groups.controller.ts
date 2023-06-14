import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { IdDto, PaginationDto, TakeUser } from '@1creator/backend';
import { StoreProjectGroupDto } from "./dto/store-project-group.dto";
import { UpdateProjectGroupDto } from "./dto/update-project-group.dto";
import { ProjectGroupsService } from "./project-groups.service";

@ApiTags('Projects Groups')
@UseGuards(AuthGuard)
@Controller('projectGroups')
export class ProjectGroupsController {
    constructor(private readonly service: ProjectGroupsService) {
    }

    @Post('/getMany')
    getMany(@Body() dto: PaginationDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreProjectGroupDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateProjectGroupDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    remove(@Body() dto: IdDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
