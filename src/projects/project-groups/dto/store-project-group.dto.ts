import { IsArrayI18n, IsIntI18n, IsNumberI18n, IsStringI18n } from '@1creator/backend';

export class StoreProjectGroupDto {
    @IsArrayI18n()
    @IsIntI18n({ each: true })
    projects: number[];

    @IsStringI18n()
    name: string;
}