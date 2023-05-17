import { Injectable } from '@nestjs/common';
import { ISocialAuthService } from './types/social-auth-service.interface';

export interface IVkUser {
    id: number,
    first_name: string,
    last_name: string,
    phone: string,
    photo_max: string,
}

@Injectable()
export class VkAuthService implements ISocialAuthService {
    async redirect() {
        const url = 'https://oauth.vk.com/authorize?' + new URLSearchParams({
            response_type: 'code',
            client_id: String(process.env.VK_CLIENT_ID),
            scope: 'email,phone_number',
            redirect_uri: process.env.BACKEND_URL + '/socialAuth/callback/vk',
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

        const url = await fetch('https://oauth.vk.com/access_token?' + new URLSearchParams({
            client_id: String(process.env.VK_CLIENT_ID),
            client_secret: String(process.env.VK_CLIENT_SECRET),
            redirect_uri: process.env.BACKEND_URL + '/socialAuth/callback/vk',
            code: query.code,
        }));

        const data = await url.json();

        const info = await this.getUserInfo(data.access_token);

        return {
            email: data.email,
            firstName: info.first_name,
            lastName: info.last_name,
            phone: info.phone,
        };
    }

    async getUserInfo(token: string): Promise<IVkUser> {
        const url = 'https://api.vk.com/method/users.get?' + new URLSearchParams({
            v: '5.131',
            access_token: token,
            fields: 'photo_max',
        });
        const res = await fetch(url);
        const json = await res.json();
        return json?.response?.[0];
    }
}
