import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GetPaymentsDto } from './dto/get-payments.dto';
import { AdminGuard } from '../auth/guards/admin.guard';
import { TakeUser } from '@1creator/backend';
import { User } from '../users/entities/user.entity';
import { AgentGuard } from '../agents/guards/agent.guard';
import { RefundPaymentDto } from './dto/refund-payment.dto';

@Controller('payments')
export class PaymentsController {
    constructor(
        private service: PaymentsService,
    ) {
    }

    @UseGuards(AdminGuard)
    @Post('/getMany')
    getMany(@Body() dto: GetPaymentsDto) {
        return this.service.getMany(dto);
    }

    @Get('/getJobCount')
    getJobCount() {
        return this.service.getJobCount();
    }

    @Get('/getFailedJobs')
    getFailedJobs() {
        return this.service.getFailedJobs();
    }

    @UseGuards(AgentGuard)
    @Post('/refund')
    refund(@Body() dto: RefundPaymentDto, @TakeUser() user: User) {
        return this.service.refund(dto, user);
    }
}