import { IsIntI18n, PartialType } from '@1creator/backend';
import { StoreDirectoryDto } from './store-directory.dto';

export class UpdateDirectoryDto extends PartialType(StoreDirectoryDto) {
    @IsIntI18n()
    id: number;
}
