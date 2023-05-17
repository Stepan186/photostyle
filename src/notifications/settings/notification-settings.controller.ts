import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationSettingsService } from './notification-settings.service';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { UpdateNotificationSettingsDto } from './dto/update-notification-settings.dto';
import { TakeUser } from '@1creator/backend';

@Controller('notifications')
export class NotificationSettingsController {
    constructor(public service: NotificationSettingsService) {
    }

    @Post('getSettings')
    @UseGuards(AuthGuard)
    getSettings(@TakeUser() user) {
        return this.service.getSettings(user);
    }

    @Post('updateSettings')
    @UseGuards(AuthGuard)
    updateSettings(@TakeUser() user, @Body() dto: UpdateNotificationSettingsDto) {
        return this.service.updateSettings(user, dto);
    }
}
