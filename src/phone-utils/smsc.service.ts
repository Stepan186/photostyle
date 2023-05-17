import { HttpException, Injectable } from '@nestjs/common';
import { firstValueFrom } from 'rxjs';
import { AxiosResponse } from 'axios';
import { HttpService } from '@nestjs/axios';

const ENDPOINT = 'https://smsc.ru/sys/send.php';

@Injectable()
export class SmscService {
    constructor(private httpService: HttpService) {
    }

    async sendSms(phone: string, body: string): Promise<AxiosResponse> {
        return await firstValueFrom(
            this.httpService.get(ENDPOINT, {
                params: {
                    login: process.env.SMSC_LOGIN,
                    psw: process.env.SMSC_PASSWORD,
                    phones: phone,
                    mes: body,
                },
            }),
        );
    }

    async call(phone: string) {
        const res = await firstValueFrom(
            this.httpService.get(ENDPOINT, {
                params: {
                    login: process.env.SMSC_LOGIN,
                    psw: process.env.SMSC_PASSWORD,
                    phones: phone,
                    mes: 'code',
                    call: 1,
                    fmt: 3,
                },
            }),
        );
        if (res.data.error_code) {
            switch (res.data.error_code) {
                case 7:
                    throw new HttpException(
                        {
                            name: 'WrongNumber',
                            message: 'Неправильный номер.',
                        },
                        400,
                    );
                default:
                    throw new HttpException(
                        {
                            name: 'CallFail',
                            message: 'Ошибка звонка. Пожалуйста, повторите позже.',
                        },
                        500,
                    );
            }
        } else {
            return res.data.code.substr(-4);
        }
    }
}
