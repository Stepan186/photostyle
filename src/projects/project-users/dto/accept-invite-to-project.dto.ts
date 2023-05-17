import { IsUuidI18n } from '@1creator/backend';

export class AcceptInviteToProjectDto {
    @IsUuidI18n()
    uuid: string;
}
