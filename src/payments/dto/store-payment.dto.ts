import { PaymentTableType, PaymentType } from '../entities/payment.entity';
import { IsInI18n, IsNumberI18n, IsStringI18n } from '@1creator/backend';

export class StorePaymentDto {

    @IsInI18n(Object.values(PaymentType))
    type: PaymentType;

    @IsNumberI18n()
    total: number;

    @IsStringI18n()
    description: string;

    @IsInI18n(Object.values(PaymentTableType))
    table: PaymentTableType;

}