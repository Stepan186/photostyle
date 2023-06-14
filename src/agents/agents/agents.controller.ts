import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PaginationDto, TakeUser, UuidDto } from '@1creator/backend';
import { AgentsService } from "./agents.service";
import { UpdateAgentDto } from "../../users/dto/update-agent.dto";
import { AdminGuard } from "../../auth/guards/admin.guard";
import { User } from "../../users/entities/user.entity";
import { AuthGuard } from "../../auth/guards/auth.guard";

@ApiTags('Agents')
@UseGuards(AdminGuard)
@Controller('agents')
export class AgentsController {
    constructor(private readonly service: AgentsService) {
    }

    @Post('/get')
    get(@Body() dto: UuidDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/getMany')
    getMany(@Body() dto: PaginationDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @Post('/update')
    update(@Body() dto: UpdateAgentDto & UuidDto, @TakeUser() user: User) {
        return this.service.update(dto, user);
    }

    @Post('/remove')
    @UseGuards(AuthGuard)
    remove(@Body() dto: UuidDto, @TakeUser() user: User) {
        return this.service.remove(dto, user);
    }
}
