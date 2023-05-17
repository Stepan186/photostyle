import { Injectable } from '@nestjs/common';
import { ISocialAuthService } from './types/social-auth-service.interface';
import { createHash } from 'crypto';

export interface IOkUser {
    id: number,
    first_name: string,
    last_name: string,
    phone: string,
    photo_max: string,
    email: string,
}

@Injectable()
export class OkAuthService implements ISocialAuthService {
    async redirect() {
        const url = 'https://connect.ok.ru/oauth/authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: String(process.env.OK_CLIENT_ID),
            scope: 'VALUABLE_ACCESS,GET_EMAIL',
            redirect_uri: process.env.BACKEND_URL + '/socialAuth/callback/ok',
        });

        return {
            url,
            statusCode: 301,
        };
    }

    async callback(query: Record<string, string>) {
        if (!query.code) {
            throw new Error();
        }

        const url = await fetch('https://api.ok.ru/oauth/token.do?' + new URLSearchParams({
            client_id: String(process.env.OK_CLIENT_ID),
            client_secret: String(process.env.OK_CLIENT_SECRET),
            grant_type: 'authorization_code',
            redirect_uri: process.env.BACKEND_URL + '/socialAuth/callback/ok',
            code: query.code,
        }), { method: 'post' });

        const data = await url.json();

        const info = await this.getUserInfo(data.access_token);
        return {
            email: info.email,
            firstName: info.first_name,
            lastName: info.last_name,
            phone: info.phone,
        };
    }

    async getUserInfo(token: string): Promise<IOkUser> {
        const sig = `application_key=${process.env.OK_CLIENT_PUBLIC_KEY}${process.env.OK_CLIENT_SECRET}fields=email`;
        const sigMd5 = createHash('md5').update(sig).digest('hex');
        const url = 'https://api.ok.ru/api/users/getCurrentUser?' + new URLSearchParams({
            application_key: String(process.env.OK_CLIENT_PUBLIC_KEY),
            access_token: token,
            sig: sigMd5,
            field: 'email',
        });
        const res = await fetch(url);
        return await res.json();
    }
}
