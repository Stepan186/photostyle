import { IsInI18n, IsNumberI18n, IsStringI18n, IsUuidI18n, MaxI18n, MinI18n } from '@1creator/backend';
import { OrderStatus } from '../entities/order.entity';
import { IsOptional } from 'class-validator';

export class UpdateOrderDto {
    @IsUuidI18n()
    uuid: string;

    @IsInI18n(Object.values(OrderStatus))
    status: OrderStatus;

    @IsOptional()
    @IsStringI18n()
    comment: string;

    @IsOptional()
    @IsStringI18n()
    privateComment: string;

    @IsOptional()
    @IsStringI18n()
    address: string;

    @IsOptional()
    @MinI18n(0)
    @MaxI18n(100)
    @IsNumberI18n()
    salePercent: number;
}