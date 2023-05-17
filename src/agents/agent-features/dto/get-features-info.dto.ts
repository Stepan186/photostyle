import { IsUuidI18n } from '@1creator/backend';

export class GetFeaturesInfoDto {
    @IsUuidI18n()
    agent: string;
}