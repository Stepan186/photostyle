import { IsOptional } from 'class-validator';
import { IsArrayI18n, IsIntI18n, IsStringI18n, PaginationDto } from '@1creator/backend';

export class GetDirectoriesDto extends PaginationDto {
    @IsOptional()
    @IsIntI18n({ each: true })
    @IsArrayI18n()
    id?: number[];

    @IsOptional()
    @IsIntI18n()
    project?: number;

    @IsOptional()
    @IsIntI18n()
    parent?: number;

    @IsOptional()
    @IsStringI18n()
    search?: string;

    @IsOptional()
    @IsIntI18n()
    level?: number;
}
