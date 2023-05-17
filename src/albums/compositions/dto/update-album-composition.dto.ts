import { PlainObject } from '@mikro-orm/core';
import { IsArray } from 'class-validator';

export class UpdateAlbumCompositionDto extends PlainObject {
    @IsArray()
    pages: any;

    @IsArray()
    regions: any;
}