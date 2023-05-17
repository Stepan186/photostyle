import { IsUuidI18n, PaginationDto } from '@1creator/backend';

export class GetAgentTransactionsDto extends PaginationDto {
    @IsUuidI18n()
    agent: string;
}