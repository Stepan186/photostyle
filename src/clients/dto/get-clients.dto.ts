import { PaginationDto } from '@1creator/backend';
import { IsOptional, IsString } from 'class-validator';

export class GetClientsDto extends PaginationDto {
    @IsOptional()
    @IsString()
    search?: string;
}
