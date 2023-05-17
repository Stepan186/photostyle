import { IsArrayI18n, IsIntI18n, IsStringI18n } from '@1creator/backend';


export class StorePhotosDto {
    @IsIntI18n()
    directory: number;

    @IsArrayI18n()
    @IsStringI18n({ each: true })
    uploads: string[];
}
