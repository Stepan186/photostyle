import { IsIntI18n, PartialType } from '@1creator/backend';
import { StorePriceDto } from './store-price.dto';

export class UpdatePriceDto extends PartialType(StorePriceDto) {
    @IsIntI18n()
    id: number;
}
