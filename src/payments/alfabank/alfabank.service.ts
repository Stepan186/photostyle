import { InjectRepository } from '@mikro-orm/nestjs';
import { Payment, PaymentStatus } from '../entities/payment.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { BadGatewayException, BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { IAlfaPayload } from '../interfaces/alfa-payload.interface';
import { IPaymentProvider, PaymentMethod } from '../interfaces/payment-provider.interface';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import process from 'process';

@Injectable()
export class AlfaBankService implements IPaymentProvider {
    uri: string;

    constructor(
        @InjectRepository(Payment)
        private repo: EntityRepository<Payment>,
        private axios: HttpService,
    ) {
        this.uri = process.env.DEBUG
            ? 'https://web.rbsuat.com/ab/rest'
            : 'https://pay.alfabank.ru/payment/rest';
    }

    async createPayment(payment: Payment, method: PaymentMethod): Promise<{ url: string; }> {
        const payload = {
            userName: process.env.ALFA_LOGIN,
            password: process.env.ALFA_PASSWORD,
            orderNumber: payment.uuid,
            amount: payment.total,
            returnUrl: 'http://woci.ru',
        };
        const response = await firstValueFrom(this.axios.post(this.uri + '/register.do', payload));
        payment.bankPayload = response.data;
        await this.repo.getEntityManager().flush();
        return { url: response.data.url };
    }

    async getStatus(payment: Payment) {
        const url = `${this.uri}/getOrderStatus.do`;
        const payload: IAlfaPayload = {
            userName: process.env.ALFA_LOGIN!,
            password: process.env.ALFA_PASSWORD!,
            orderId: payment.uuid, // todo uuid от банка
            language: 'RU',
        };

        const response = await firstValueFrom(this.axios.post<{ status: number }>(url, payload));
        switch (response.data.status) {
            case 0:
                return PaymentStatus.Created;
            case 1:
                return PaymentStatus.Succeeded;
            case 2:
                return PaymentStatus.Succeeded;
            case 3:
                return PaymentStatus.Failed;
            case 4:
                return PaymentStatus.Refunded;
            case 5:
                return PaymentStatus.Refunded;
            case 6:
                return PaymentStatus.Failed;
            default:
                return payment.status;
        }
    }

    async refund(payment: Payment) {
        const url = `${this.uri}/refund.do`;
        const payload = {
            userName: process.env.ALFA_LOGIN,
            password: process.env.ALFA_PASSWORD,
            // orderId: payment.bankId,
            amount: payment.total,
        };

        const response = await firstValueFrom(this.axios.post<{
            errorCode: string,
            errorMessage: string
        }>(url, payload));

        switch (+response.data.errorCode) {
            case 0:
                payment.assign({ status: PaymentStatus.Refunded });
                await this.repo.getEntityManager().flush();
                return payment;
            default:
                throw new BadRequestException(`${response.data.errorMessage}`);
        }
    }
}