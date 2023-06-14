import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentGuard } from '../guards/agent.guard';
import { AgentPaymentsService } from './agent-payments.service';
import { TopUpBalanceDto } from './dto/top-up-balance.dto';
import { PaginationDto, TakeUser } from '@1creator/backend';
import { GetAgentPaymentsDto } from './dto/get-agent-payments.dto';

@ApiTags('Agent payments')
@UseGuards(AgentGuard)
@Controller('agentPayments')
export class AgentPaymentsController {
    constructor(
        private readonly service: AgentPaymentsService,
    ) {
    }

    @UseGuards(AgentGuard)
    @Post('topUpBalance')
    topUpBalance(@Body() dto: TopUpBalanceDto, @TakeUser() user) {
        return this.service.store(dto, user);
    }

    @UseGuards(AgentGuard)
    @Post('getMany')
    getMany(@Body() dto: GetAgentPaymentsDto, @TakeUser() user) {
        return this.service.getMany(dto, user);
    }
}

/*
* 1. пополнение баланса бонусом
* 2. пополнение баланса через панель агента
* 3. оплата заказ в ЛК клиента
* */