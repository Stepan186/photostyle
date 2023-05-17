import { IsIntI18n } from '@1creator/backend';

export class DeleteProjectDto {
    @IsIntI18n()
    id: number;
}
