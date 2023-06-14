import { Payment, PaymentTableType } from '../../payments/entities/payment.entity';
import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { Project } from "../../projects/projects/entities/project.entity";

@Entity({ discriminatorValue: PaymentTableType.ProjectPrepayment })
export class ProjectPrepayment extends Payment {
    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    fee: string | number;

    @ManyToOne(() => Project)
    project: Project;
}