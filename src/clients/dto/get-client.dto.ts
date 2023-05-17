import { IsUuidI18n } from '@1creator/backend';

export class GetClientDto {
    @IsUuidI18n()
    uuid: string;
}
