import { IsOptional, IsUUID } from 'class-validator';
import { IsArrayI18n, PaginationDto } from '@1creator/backend';

export class GetUsersDto extends PaginationDto {
    @IsOptional()
    @IsUUID(4, { each: true })
    @IsArrayI18n()
    uuid?: string[];
}
