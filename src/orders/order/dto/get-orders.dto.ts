import {
    IsArrayI18n,
    IsDateStringI18n,
    IsInI18n,
    IsIntI18n,
    IsNumberI18n,
    IsUuidI18n,
    PaginationDto,
} from '@1creator/backend';
import { IsIn, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { OrderStatus } from '../entities/order.entity';

export enum UnloadingStatus {
    Unloaded = 'unloaded',
    NotUnloaded = 'not_unloaded',
}

export class GetOrdersDto extends PaginationDto {
    @IsOptional()
    @IsUuidI18n(4, { each: true })
    @IsArrayI18n()
    uuid?: string[];

    @IsOptional()
    @IsUuidI18n(4)
    user?: string;

    @IsOptional()
    @IsIntI18n({ each: true })
    @Transform(t => [t.value].flat())
    @IsArrayI18n()
    project?: number[];

    @IsOptional()
    @IsNumberI18n()
    projectGroup?: number;

    @IsOptional()
    @IsNumberI18n()
    unloading?: number;

    @IsOptional()
    @IsString({ each: true })
    @IsArrayI18n()
    relations?: 'items'[];

    @IsOptional()
    @IsInI18n(Object.values(OrderStatus), { each: true })
    @Transform(t => [t.value].flat())
    @IsArrayI18n()
    status?: OrderStatus[];

    @IsOptional()
    @IsIn(Object.values(UnloadingStatus))
    unloadingStatus?: UnloadingStatus;

    @IsOptional({ each: true })
    @IsArrayI18n()
    createdAt?: [string?, string?];
}
