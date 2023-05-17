import { Controller, Get, Param, Query, Redirect, Req, Request } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SocialAuthService } from './social-auth.service';

@ApiTags('Social auth')
@Controller('socialAuth')
export class SocialAuthController {

    constructor(
        private readonly socialAuthService: SocialAuthService,
    ) {
    }

    @Get('/:provider')
    @Redirect()
    async redirect(@Param('provider') provider: string) {
        return this.socialAuthService.redirect(provider);
    }

    @Get('/callback/:provider')
    @Redirect()
    async callback(
        @Param('provider') provider: string,
        @Query() query: Record<string, string>,
        @Req() req: Request,
    ) {
        return this.socialAuthService.callback(provider, query, req);
    }
}
