import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKeyType, Property } from '@mikro-orm/core';
import { Agent } from '../../agents/entities/agent.entity';
import { Feature } from './feature.entity';

@Entity()
export class AgentFeature extends BaseEntity<AgentFeature, 'agent' | 'feature'> {
    [PrimaryKeyType]: [string, string];
    [OptionalProps]: 'createdAt';

    @ManyToOne(() => Agent, { primary: true, onDelete: 'cascade' })
    agent: Agent;

    @ManyToOne(() => Feature, { primary: true, onDelete: 'cascade' })
    feature: Feature;

    @Property()
    createdAt = new Date();
}