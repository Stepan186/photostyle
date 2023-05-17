import { IsNumberI18n, IsStringI18n } from '@1creator/backend';
import { ValidateIf } from 'class-validator';

export class GetCartDto {
    @ValidateIf(o => !o.project)
    @IsStringI18n()
    uuid?: string;

    @ValidateIf(o => !o.uuid)
    @IsNumberI18n()
    project?: number;
}