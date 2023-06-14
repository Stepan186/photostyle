import { IsInI18n, IsNumberI18n } from '@1creator/backend';
import { FeatureType } from '../entites/feature.entity';

export class UpdateFeatureDto {
    @IsInI18n(Object.values(FeatureType))
    id: FeatureType;

    @IsNumberI18n()
    price: number;
}