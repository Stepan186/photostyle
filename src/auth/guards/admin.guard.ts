import { ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { SilentAuthGuard } from './silent-auth.guard';

@Injectable()
export class AdminGuard extends SilentAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await this.authorize(context);
        const { user }: { user?: User } = context.switchToHttp().getRequest();
        return !!user?.isAdmin;
    }
}
