import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { SYSTEM_PERMISSIONS } from './project-permissions.service';

@Controller('projectPermissions')
export class PermissionsController {
    @UseGuards(AuthGuard)
    @Get()
    async getPermissions() {
        return SYSTEM_PERMISSIONS;
    }
}
