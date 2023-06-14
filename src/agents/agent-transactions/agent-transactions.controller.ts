import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { GetAgentTransactionsDto } from './dto/get-agent-transactions.dto';
import { AgentGuard } from '../guards/agent.guard';
import { StoreAgentTransactionDto } from './dto/store-agent-transaction.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { AgentTransactionsService } from './agent-transactions.service';
import { TakeUser } from '@1creator/backend';
import { User } from '../../users/entities/user.entity';


@ApiTags('Agent transactions')
@Controller('agentTransactions')
export class AgentTransactionsController {
    constructor(
        private readonly service: AgentTransactionsService,
    ) {
    }

    @UseGuards(AgentGuard)
    @Post('getMany')
    getMany(@Body() dto: GetAgentTransactionsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }

    @UseGuards(AdminGuard)
    @Post('store')
    store(@Body() dto: StoreAgentTransactionDto) {
        return this.service.store(dto);
    }
}