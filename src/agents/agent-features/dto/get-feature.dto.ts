import { IsInI18n } from '@1creator/backend';
import { FeatureType } from '../entites/feature.entity';

export class GetFeatureDto {
    @IsInI18n(Object.values(FeatureType))
    id: FeatureType;
}