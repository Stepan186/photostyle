import { IsUuidI18n } from '@1creator/backend';

export class RefundPaymentDto {
    @IsUuidI18n()
    uuid: string;
}