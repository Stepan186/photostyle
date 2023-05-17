import { IsNumberI18n, PartialType } from '@1creator/backend';
import { StoreProjectGroupDto } from './store-project-group.dto';

export class UpdateProjectGroupDto extends PartialType(StoreProjectGroupDto) {
    @IsNumberI18n()
    id: number;
}