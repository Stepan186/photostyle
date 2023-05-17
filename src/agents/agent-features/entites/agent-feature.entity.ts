import { BaseEntity, Entity, ManyToOne, OptionalProps, PrimaryKeyType, Property, Unique } from '@mikro-orm/core';
import { Agent } from '../../agents/entities/agent.entity';
import { Feature } from "./feature.entity";

@Unique({ properties: ['agent', 'feature'] })
@Entity()
export class AgentFeature extends BaseEntity<AgentFeature, 'agent' | 'feature'> {
    [PrimaryKeyType]: [string, string];
    [OptionalProps]: 'createdAt';

    @ManyToOne(() => Agent, { primary: true })
    agent: Agent;

    @ManyToOne(() => Feature, { primary: true })
    feature: Feature;

    @Property()
    createdAt = new Date();
}