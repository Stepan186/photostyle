import { IRedirect } from './redirect.interface';
import { ISocialAuthUser } from './social-auth-user.interface';

export interface ISocialAuthService {
    redirect(): Promise<IRedirect>;

    callback(query: Record<string, string>): Promise<ISocialAuthUser>;
}