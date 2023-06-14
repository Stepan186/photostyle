import { IsInI18n, IsStringI18n } from '@1creator/backend';
import { PaymentStatus } from '../../entities/payment.entity';

export class UpdatePaymentStatusDto {
    @IsStringI18n()
    uuid: string;

    @IsInI18n(Object.values(PaymentStatus))
    status: PaymentStatus;
}