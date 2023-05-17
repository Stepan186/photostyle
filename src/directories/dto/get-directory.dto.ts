import { IsBooleanI18n, IsIntI18n } from '@1creator/backend';

export class GetDirectoryDto {
    @IsIntI18n()
    id: number;

    @IsBooleanI18n()
    full?: boolean = true;
}
