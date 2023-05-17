import { Entity, ManyToOne, OneToOne, Property } from '@mikro-orm/core';
import { Agent } from '../../agents/entities/agent.entity';
import { AgentTransaction } from '../../agent-transactions/entity/agent-transaction.entity';
import { Payment } from '../../../payments/entities/payment.entity';

@Entity({ discriminatorValue: 'agent' })
export class AgentPayment extends Payment {
    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    fee: string | number;

    @ManyToOne(() => Agent)
    agent: Agent;

    @OneToOne(() => AgentTransaction)
    agentTransaction: AgentTransaction;
}