import { ExecutionContext, Injectable } from '@nestjs/common';
import { SilentAuthGuard } from './silent-auth.guard';

@Injectable()
export class AuthGuard extends SilentAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        return await this.authorize(context) || false;
    }
}
