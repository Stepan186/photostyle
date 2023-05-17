import { IsNumberI18n, IsUuidI18n } from '@1creator/backend';
import { IsOptional, ValidateNested } from 'class-validator';
import { UpdateAlbumCompositionDto } from '../../../albums/compositions/dto/update-album-composition.dto';
import { Type } from 'class-transformer';

export class UpdateCartAlbumDto {
    @IsUuidI18n()
    cart: string;

    @IsNumberI18n()
    id: number;

    @IsOptional()
    @IsNumberI18n()
    count: number;

    @Type(() => UpdateAlbumCompositionDto)
    @ValidateNested()
    composition: UpdateAlbumCompositionDto;
}