import { IsNumberI18n } from '@1creator/backend';

export class StoreCartDto {
    @IsNumberI18n()
    project: number;
}