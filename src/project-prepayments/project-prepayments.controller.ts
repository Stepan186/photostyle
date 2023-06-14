import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { AuthGuard } from "../auth/guards/auth.guard";
import { User } from "../users/entities/user.entity";
import { GetProjectPrepaymentsDto } from "./dto/get-project-prepayments.dto";
import { ProjectPrepaymentsService } from "./project-prepayments.service";
import { StoreProjectPrepaymentDto } from "./dto/store-project-prepayment.dto";

@ApiTags('Project prepayments')
@UseGuards(AuthGuard)
@Controller('projectPrepayments')
export class ProjectPrepaymentsController {
    constructor(private readonly service: ProjectPrepaymentsService) {
    }

    @Post('/getMany')
    getMany(@Body() dto: GetProjectPrepaymentsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/store')
    store(@Body() dto: StoreProjectPrepaymentDto, @TakeUser() user: User) {
        return this.service.store(dto, user);
    }
}
