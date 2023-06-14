import { IsOptional } from 'class-validator';
import { IsArrayI18n, IsInI18n, IsUuidI18n, PaginationDto } from '@1creator/backend';

export class GetUsersDto extends PaginationDto {
    @IsOptional()
    @IsUuidI18n(4, { each: true })
    @IsArrayI18n()
    uuid?: string[];

    @IsOptional()
    @IsInI18n(['orders'], { each: true })
    @IsArrayI18n()
    relations?: string[];
}
