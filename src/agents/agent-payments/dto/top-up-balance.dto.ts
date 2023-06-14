import { IsInI18n, IsNumberI18n } from '@1creator/backend';
import { PaymentType } from '../../../payments/entities/payment.entity';

export class TopUpBalanceDto {
    @IsNumberI18n()
    total: number;

    @IsInI18n(Object.values(PaymentType))
    type: PaymentType;
}