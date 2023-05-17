import { IsArrayI18n, IsNumberI18n, PaginationDto } from '@1creator/backend';
import { Transform } from "class-transformer";

export class GetPriceItemsDto extends PaginationDto {
    @IsArrayI18n()
    @Transform(t => [t.value].flat())
    @IsNumberI18n()
    id: number[];
}
