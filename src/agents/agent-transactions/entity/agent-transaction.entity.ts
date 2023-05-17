import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Agent } from '../../agents/entities/agent.entity';
import { AgentPayment } from '../../agent-payments/entities/agent-payment.entity';

@Entity()
export class AgentTransaction extends BaseEntity<AgentTransaction, 'uuid'> {
    [OptionalProps]: 'createdAt';

    @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
    uuid: string;

    @ManyToOne(() => Agent)
    agent: Agent;

    @Property()
    description: string;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    change: string | number;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    balance: string | number;

    // @ManyToOne(() => AgentPayment, { nullable: true })
    // agentPayment?: AgentPayment;

    @Property()
    createdAt = new Date();
}