import { IsIntI18n } from '@1creator/backend';

export class GetPriceDto {
    @IsIntI18n()
    id: number;
}
