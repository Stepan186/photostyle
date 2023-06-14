import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder, ref } from '@mikro-orm/core';
import { GetProjectPrepaymentsDto } from "./dto/get-project-prepayments.dto";
import { ProjectPrepayment } from "./entities/project-prepayment.entity";
import { User } from "../users/entities/user.entity";
import { StoreProjectPrepaymentDto } from "./dto/store-project-prepayment.dto";
import { PaymentsService } from "../payments/payments.service";
import { PaymentStatus } from "../payments/entities/payment.entity";
import { ProjectsService } from "../projects/projects/projects.service";
import { Project } from "../projects/projects/entities/project.entity";

@Injectable()
export class ProjectPrepaymentsService {
    constructor(
        @InjectRepository(ProjectPrepayment)
        private repo: EntityRepository<ProjectPrepayment>,
        private paymentsService: PaymentsService,
        private projectsService: ProjectsService,
    ) {
    }

    async getMany(dto: GetProjectPrepaymentsDto, currentUser: User) {
        const where: FilterQuery<ProjectPrepayment> = {};

        if (dto.project) {
            where.project = dto.project;
        }

        if (!currentUser.isAdmin) {
            where.project = { usersPivot: { user: currentUser } };
        }

        const [items, count] = await this.repo.findAndCount(where, {
            populate: ['project', 'user'],
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { createdAt: QueryOrder.DESC },
        });
        return { items, count };
    }

    async store(dto: StoreProjectPrepaymentDto, currentUser: User) {
        const agent = await this.projectsService.getProjectAgent(ref(Project, dto.project));

        if (!agent) {
            throw  new Error('Агент не найден');
        }

        const payment = await this.repo.create({
            ...dto,
            description: 'Предоплата за проект',
            user: currentUser,
            status: PaymentStatus.Created,
            fee: agent.fee * dto.total / 100,
        });
        await this.repo.getEntityManager().flush();
        return await this.paymentsService.register(payment);
    }
}
