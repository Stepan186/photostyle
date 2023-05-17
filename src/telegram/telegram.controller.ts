import { Body, Controller, Post } from '@nestjs/common';
import { TelegramService } from './telegram.service';

@Controller('telegram')
export class TelegramController {
    constructor(public service: TelegramService) {
    }

    @Post('webhook')
    webhook(@Body() data: any) {
        return this.service.webhook(data);
    }

    @Post('getUpdates')
    getUpdates() {
        return this.service.getUpdates();
    }
}
