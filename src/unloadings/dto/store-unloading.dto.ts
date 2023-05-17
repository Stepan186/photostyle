import { IsArrayI18n, IsUuidI18n } from '@1creator/backend';

export class StoreUnloadingDto {
    @IsArrayI18n()
    @IsUuidI18n(4, { each: true })
    orders: string[];
}