import { Entity, ManyToOne, OneToOne } from '@mikro-orm/core';
import { Agent } from '../../agents/entities/agent.entity';
import { AgentTransaction } from '../../agent-transactions/entity/agent-transaction.entity';
import { Payment, PaymentTableType } from '../../../payments/entities/payment.entity';

@Entity({ discriminatorValue: PaymentTableType.Agent })
export class AgentPayment extends Payment {
    @ManyToOne(() => Agent)
    agent: Agent;

    @OneToOne(() => AgentTransaction, { nullable: true })
    agentTransaction?: AgentTransaction;
}