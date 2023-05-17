import { IsInI18n, IsNumberI18n, IsStringI18n } from '@1creator/backend';
import { PaymentType } from '../entities/payment.entity';

export class StorePaymentDto {

    @IsInI18n(Object.values(PaymentType))
    type: PaymentType;

    @IsStringI18n()
    description: string;

    @IsNumberI18n()
    total: number;
}