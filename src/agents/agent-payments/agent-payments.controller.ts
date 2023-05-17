import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { AgentPaymentsService } from './agent-payments.service';

@ApiTags('Agent payments')
@UseGuards(AuthGuard)
@Controller('agentPayments')
export class AgentPaymentsController {
    constructor(
        private readonly service: AgentPaymentsService,
    ) {
    }
}