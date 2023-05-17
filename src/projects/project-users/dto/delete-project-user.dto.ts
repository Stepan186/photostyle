import { IsIntI18n, IsUuidI18n } from '@1creator/backend';

export class DeleteProjectUserDto {
    @IsUuidI18n(4)
    user: string;

    @IsIntI18n()
    project: number;
}