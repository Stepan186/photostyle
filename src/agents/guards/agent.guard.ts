import { ExecutionContext, Injectable } from '@nestjs/common';
import { User } from '../../users/entities/user.entity';
import { SilentAuthGuard } from "../../auth/guards/silent-auth.guard";

@Injectable()
export class AgentGuard extends SilentAuthGuard {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        await this.authorize(context);
        const request: { user?: User, body: Record<string, any> } = context.switchToHttp().getRequest();
        const user = request.user;

        if (!user) {
            return false;
        }

        if (user.isAdmin) {
            if (!request.body.agent) {
                request.body.agent = user.agent?.uuid;
            }
            return true;
        } else if (user.isAgent) {
            request.body.agent = user.agent?.uuid;
            return true;
        } else {
            return false;
        }
    }
}
