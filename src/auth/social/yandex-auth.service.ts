import { Injectable } from '@nestjs/common';
import { ISocialAuthService } from './types/social-auth-service.interface';

export interface IYandexUser {
    id: string,
    login: string,
    client_id: string,
    display_name: string,
    real_name: string,
    first_name: string,
    last_name: string,
    sex: string,
    default_email: string,
    default_phone?: {
        'id': number,
        'number': `+${number}`
    },
}

@Injectable()
export class YandexAuthService implements ISocialAuthService {
    async redirect() {
        const url = 'https://oauth.yandex.ru/authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: String(process.env.YANDEX_CLIENT_ID),
            force_confirm: '1',
            redirect_uri: process.env.BACKEND_URL + '/socialAuth/callback/yandex',
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

        const authHeader = 'Basic '
            + Buffer.from(`${process.env.YANDEX_CLIENT_ID}:${process.env.YANDEX_CLIENT_SECRET}`).toString('base64');

        const url = await fetch('https://oauth.yandex.ru/token', {
            method: 'post',
            body: new URLSearchParams({
                grant_type: 'authorization_code',
                code: query.code,
            }),
            headers: { Authorization: authHeader },
        });

        const data = await url.json();

        const info = await this.getUserInfo(data.access_token);
        return {
            email: info.default_email,
            firstName: info.first_name,
            lastName: info.last_name,
            phone: info.default_phone?.number.substr(1),
        };
    }

    async getUserInfo(token: string): Promise<IYandexUser> {
        const url = 'https://login.yandex.ru/info?' + new URLSearchParams({ format: 'json' });
        const res = await fetch(url, { headers: { Authorization: `OAuth ${token}` } });
        return await res.json();
    }
}
