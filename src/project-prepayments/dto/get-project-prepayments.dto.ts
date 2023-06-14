import { IsNumberI18n, PaginationDto } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class GetProjectPrepaymentsDto extends PaginationDto {
    @IsOptional()
    @IsNumberI18n()
    project?: number;
}
