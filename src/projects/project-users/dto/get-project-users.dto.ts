import { IsIntI18n, PaginationDto } from '@1creator/backend';

export class GetProjectUsersDto extends PaginationDto {
    @IsIntI18n()
    project: number;
}
