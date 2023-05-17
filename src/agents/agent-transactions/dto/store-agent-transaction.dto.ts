import { IsNumberI18n, IsStringI18n, IsUuidI18n } from '@1creator/backend';
import { IsOptional } from 'class-validator';

export class StoreAgentTransactionDto {
    @IsNumberI18n()
    change: number;

    @IsStringI18n()
    description: string;

    @IsOptional()
    @IsStringI18n()
    agentPayment?: string;

    @IsOptional()
    @IsUuidI18n()
    agent: string;
}