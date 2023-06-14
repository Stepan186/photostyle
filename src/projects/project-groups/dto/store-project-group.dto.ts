import { IsArrayI18n, IsIntI18n, IsStringI18n } from '@1creator/backend';
import { IsOptional } from "class-validator";

export class StoreProjectGroupDto {
    @IsOptional()
    @IsArrayI18n()
    @IsIntI18n({ each: true })
    projects?: number[];

    @IsStringI18n()
    name: string;
}