import { IsIntI18n } from '@1creator/backend';

export class PaidPageDto {
    @IsIntI18n()
    composition: number;

    @IsIntI18n()
    page: number;
}