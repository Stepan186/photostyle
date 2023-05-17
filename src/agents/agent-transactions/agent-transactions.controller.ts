import { AgentTransactionsService } from './agent-transactions.service';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TakeUser } from '@1creator/backend';
import { User } from '../../users/entities/user.entity';
import { GetAgentTransactionsDto } from './dto/get-agent-transactions.dto';
import { AgentGuard } from "../guards/agent.guard";


@ApiTags('Agent transactions')
@UseGuards(AgentGuard)
@Controller('agentTransactions')
export class AgentTransactionsController {
    constructor(
        private readonly service: AgentTransactionsService,
    ) {
    }

    @Post('getMany')
    getMany(@Body() dto: GetAgentTransactionsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }
}