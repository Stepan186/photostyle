import { StoreUserDto } from './store-user.dto';
import { IsUuidI18n, PartialType } from '@1creator/backend';

export class UpdateUserDto extends PartialType(StoreUserDto) {
    @IsUuidI18n()
    uuid: string;
}
