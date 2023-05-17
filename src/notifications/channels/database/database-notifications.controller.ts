import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { NotificationsService } from '../../notifications.service';
import { AuthGuard } from '../../../auth/guards/auth.guard';
import { ReadNotificationsDto } from './dto/read-notifications.dto';
import { TakeUser } from '@1creator/backend';
import { DatabaseNotificationsService } from './database-notifications.service';

@Controller('notifications')
export class DatabaseNotificationsController {
    constructor(public service: DatabaseNotificationsService) {
    }

    @Post('getMany')
    @UseGuards(AuthGuard)
    public getMany(@TakeUser() user) {
        return this.service.getMany(user);
    }

    @Post('read')
    @UseGuards(AuthGuard)
    public read(@TakeUser() user, @Body() dto: ReadNotificationsDto) {
        return this.service.read(user, dto);
    }
}
