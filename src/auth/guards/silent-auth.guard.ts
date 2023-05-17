import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';

@Injectable()
export class SilentAuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
    ) {
    }

    async authorize(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const header: string = request.headers?.authorization;
        const jwt = header?.split(' ')[1];
        try {
            request.user = await this.jwtService.getUserByJwt(jwt);
            return true;
        } catch (err) {
            if (err instanceof Error) {
                throw new UnauthorizedException('Сессия устарела', {
                    cause: err,
                    description: err.name,
                });
            }
            return false;
        }
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        await this.authorize(context);
        return true;
    }
}
