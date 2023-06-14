import { IsNumberI18n, IsStringI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class GetOrderDto {
    @IsOptional()
    @IsStringI18n()
    uuid?: string;

    @IsOptional()
    @IsNumberI18n()
    project?: number;
}