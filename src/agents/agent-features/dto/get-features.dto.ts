import { IsInI18n, PaginationDto } from '@1creator/backend';
import { IsArray, IsOptional } from 'class-validator';
import { FeatureType } from '../entites/feature.entity';

export class GetFeaturesDto extends PaginationDto {
    @IsOptional()
    @IsArray()
    @IsInI18n(Object.values(FeatureType))
    id: FeatureType[];
}