import { IsOptional } from 'class-validator';
import { IsArrayI18n, IsIntI18n, PaginationDto } from '@1creator/backend';

export class GetProjectsDto extends PaginationDto {
    @IsOptional()
    @IsIntI18n({ each: true })
    @IsArrayI18n()
    id?: number[];
}
