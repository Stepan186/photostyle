import { IsIntI18n, IsStringI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class GetAlbumDto {
    @IsIntI18n()
    id: number;

    @IsOptional()
    @IsIntI18n()
    project?: number;
}
