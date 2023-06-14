import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { EmailSettingsService } from './email-settings.service';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { ApiTags } from '@nestjs/swagger';
import { UpdateEmailSettingsDto } from './dto/update-email-settings.dto';


@ApiTags('Email Settings')
@UseGuards(AdminGuard)
@Controller('smtp')
export class EmailSettingsController {
    constructor(
        private service: EmailSettingsService,
    ) {
    }

    @Post('/get')
    get() {
        return this.service.get();
    }

    @Post('/update')
    update(@Body() dto: UpdateEmailSettingsDto) {
        return this.service.update(dto);
    }

}