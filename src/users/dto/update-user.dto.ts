import { StoreUserDto } from './store-user.dto';
import { IsIntI18n, PartialType } from '@1creator/backend';

export class UpdateUserDto extends PartialType(StoreUserDto) {
    @IsIntI18n()
    uuid: string;
}
