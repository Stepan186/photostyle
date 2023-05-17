import { IsUuidI18n } from '@1creator/backend';

export class StoreOrderDto {
    @IsUuidI18n()
    cart: string;
}