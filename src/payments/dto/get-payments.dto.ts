import { IsUuidI18n, PaginationDto } from '@1creator/backend';
import { IsOptional } from "class-validator";

export class GetPaymentsDto extends PaginationDto {
    @IsOptional()
    @IsUuidI18n()
    user: string;
}