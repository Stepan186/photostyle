import { IsInI18n, IsUuidI18n } from "@1creator/backend";
import { FeatureType } from "../entites/feature.entity";

export class ToggleFeatureDto {
    @IsUuidI18n()
    agent: string;

    @IsInI18n(Object.values(FeatureType))
    feature: FeatureType;
}