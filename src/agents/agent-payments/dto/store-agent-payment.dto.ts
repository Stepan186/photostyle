import { StorePaymentDto } from '../../../payments/dto/store-payment.dto';
import { IsArrayI18n, IsInI18n, IsNumberI18n, IsStringI18n } from '@1creator/backend';
import { PaymentTableType } from '../../../payments/entities/payment.entity';
import { FeatureType } from '../../agent-features/entites/feature.entity';
import { Type } from 'class-transformer';
import { ValidateNested } from 'class-validator';

export class StoreAgentPaymentDto extends StorePaymentDto {

    @IsInI18n(Object.values(PaymentTableType.Agent))
    table: PaymentTableType.Agent;

}

export class OrderBundleDto {
    @IsArrayI18n()
    @IsInI18n(Object.values(FeatureType))
    cartItems: FeatureType[];
}

export class CartItemDto {
    @IsStringI18n()
    positionId: string;

    @IsStringI18n()
    name: string;

    @IsStringI18n()
    itemCode: string;

    @IsNumberI18n()
    itemPrice: number;

    @Type(() => QuantityDto)
    @ValidateNested()
    quantity: QuantityDto;

    @Type(() => TaxDto)
    @ValidateNested()
    tax: TaxDto;
}

export class QuantityDto {
    @IsNumberI18n()
    value: number;

    @IsStringI18n()
    measure: string;
}

export class TaxDto {
    @IsNumberI18n()
    taxType = 6;
}

