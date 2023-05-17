import { IsIntI18n } from '@1creator/backend';

export class DeletePriceDto {
    @IsIntI18n()
    id: number;
}
