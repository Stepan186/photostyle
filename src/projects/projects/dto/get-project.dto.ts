import { IsIntI18n } from '@1creator/backend';

export class GetProjectDto {
    @IsIntI18n()
    id: number;
}
