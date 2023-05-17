import { IsIntI18n, IsStringI18n } from '@1creator/backend';

export class JoinProjectDto {
    @IsIntI18n()
    project: number;

    @IsStringI18n()
    password: string;
}
