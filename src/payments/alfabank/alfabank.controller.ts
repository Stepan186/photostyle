import { Controller, Post } from '@nestjs/common';
import { AlfaBankService } from './alfabank.service';
import { PaymentStatus } from '../entities/payment.entity';

@Controller('alfabank')
export class AgentPaymentsController {
    constructor(
        private readonly service: AlfaBankService,
    ) {
    }

    @Post('webhook')
    webhook(dto: { uuid: string, status: PaymentStatus }) {

    }
}