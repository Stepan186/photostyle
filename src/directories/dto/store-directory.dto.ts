import { IsOptional } from 'class-validator';
import { IsArrayI18n, IsNumberI18n, IsStringI18n, MaxI18n, MinI18n, MinLengthI18n } from '@1creator/backend';

export class StoreDirectoryDto {
  @IsStringI18n()
  @MinLengthI18n(1)
  name: string;

  @IsOptional()
  @IsStringI18n()
  comment: string;

  @IsNumberI18n()
  project: number;

  @IsOptional()
  @IsNumberI18n()
  parent?: number;

  @IsOptional()
  @IsArrayI18n()
  @IsNumberI18n({}, { each: true })
  disabledPriceItems?: number[];

  @IsOptional()
  @IsNumberI18n()
  @MinI18n(0)
  @MaxI18n(1)
  watermarkOpacity?: number;
}
