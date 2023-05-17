import { IsArrayI18n, IsIntI18n, PartialType } from '@1creator/backend';
import { StoreProjectDto } from './store-project.dto';
import { Type } from 'class-transformer';
import { IsOptional, ValidateNested } from 'class-validator';
import { StoreAlbumDto } from '../../../albums/albums/dto/store-album.dto';

export class UpdateProjectAlbumDto extends StoreAlbumDto {
    @IsOptional()
    @IsIntI18n()
    id: number;
}

export class UpdateProjectDto extends PartialType(StoreProjectDto) {
    @IsIntI18n()
    id: number;

    @IsOptional()
    @Type(() => UpdateProjectAlbumDto)
    @ValidateNested({ each: true })
    @IsArrayI18n()
    albums: UpdateProjectAlbumDto[];
}
