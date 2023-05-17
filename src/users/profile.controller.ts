import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/guards/auth.guard';
import { User } from './entities/user.entity';
import { ProfileService } from './profile.service';
import { TakeUser } from '@1creator/backend';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Controller('profile')
export class ProfileController {
    constructor(private readonly profileService: ProfileService) {
    }

    @UseGuards(AuthGuard)
    @Post('get')
    async get(@TakeUser() user: User) {
        return this.profileService.get({ uuid: user.uuid });
    }

    @UseGuards(AuthGuard)
    @Post('update')
    async update(@TakeUser() user: User, @Body() dto: UpdateProfileDto) {
        return this.profileService.update(user, dto);
    }
}
