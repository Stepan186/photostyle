import { IsInI18n, IsNumberI18n, PaginationDto } from '@1creator/backend';
import { PaymentType } from "../../payments/entities/payment.entity";

export class StoreProjectPrepaymentDto extends PaginationDto {
    @IsNumberI18n()
    project: number;

    @IsNumberI18n()
    total: number;

    @IsInI18n(Object.values(PaymentType))
    type: PaymentType;
}
