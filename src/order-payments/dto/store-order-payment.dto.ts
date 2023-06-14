import { IsInI18n, IsStringI18n } from '@1creator/backend';
import { PaymentType } from '../../payments/entities/payment.entity';

export class StoreOrderPaymentDto {
    @IsStringI18n()
    order: string;

    @IsInI18n(Object.values(PaymentType))
    type: PaymentType;
}