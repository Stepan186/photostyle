import { IsIntI18n, PaginationDto } from '@1creator/backend';

export class GetAlbumsDto extends PaginationDto {
    @IsIntI18n()
    project: number;
}
