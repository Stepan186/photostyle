import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

const ENDPOINT = 'https://zvonok.com/manager/cabapi_external/api/v1';

@Injectable()
export class ZvonokService {
    constructor(private httpService: HttpService) {
    }

    async call(phone: string, text: string) {
        await firstValueFrom(
            this.httpService.get(ENDPOINT + '/phones/call/', {
                params: {
                    public_key: process.env.ZVONOK_PUBLIC_KEY,
                    campaign_id: process.env.ZVONOK_CAMPAIGN_ID,
                    phone,
                    text,
                },
            }),
        );
        return 1;
    }
}
