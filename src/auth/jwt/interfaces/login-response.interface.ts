import { User } from '../../../users/entities/user.entity';

export interface ILoginResponse {
    tokens: {
        accessToken: string,
        refreshToken: string,
    };
    user: User;
}