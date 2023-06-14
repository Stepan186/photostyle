import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Feature } from './entites/feature.entity';
import { GetFeatureDto } from './dto/get-feature.dto';
import { GetFeaturesInfoDto } from './dto/get-features-info.dto';
import { AgentFeature } from './entites/agent-feature.entity';
import { omit } from '@1creator/common';
import { ToggleFeatureDto } from './dto/toggle-feature.dto';
import { AgentTransactionsService } from '../agent-transactions/agent-transactions.service';
import { ref } from '@mikro-orm/core';
import { Agent } from '../agents/entities/agent.entity';
import { createValidationException } from '@1creator/backend';
import { BadRequestException } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { LowBalanceNotification } from '../agents/notification/low-balance.notification';

type FeaturesInfoResponse = {
    features: Array<Omit<Feature, 'agentFeatures'> & { enabledAt: Date | null }>,
    monthlyCost: number;
    dailyCost: number;
    memoryUsage: number;
    freeMemoryLimit: number;
    balance: number;
}

export class AgentFeaturesService {
    constructor(
        @InjectRepository(Feature)
        private featuresRepo: EntityRepository<Feature>,
        @InjectRepository(AgentFeature)
        private agentFeaturesRepo: EntityRepository<AgentFeature>,
        private agentTransactionsService: AgentTransactionsService,
    ) {
    }

    async get(dto: GetFeatureDto) {
        return await this.featuresRepo.findOneOrFail(dto);
    }

    async getMemoryUsage(agent: string) {
        const res: Array<{ size?: number }> = await this.featuresRepo.getEntityManager().execute(`
            select sum(DISTINCT u.size) ::int as size
            from project p
                left join directory d
            on d.project_id = p.id
                left join photo ph on d.id = ph.directory_id
                inner join "user" us on us.agent_uuid = '${agent}'
                --                      inner join project_user pu
                --                                 on pu.project_id = p.id and pu.user_uuid = us.uuid and
                --                                    pu.role = 'owner'
                left join upload u on u.uuid = ph.original_uuid or u.uuid = ph.watermarked_uuid
            group by p.id
        `);
        return res[0]?.size || 0;
    }

    async getInfo(dto: GetFeaturesInfoDto): Promise<FeaturesInfoResponse> {
        const allFeatures = await this.featuresRepo.findAll({
            populate: ['agentFeatures'],
            populateWhere: { agentFeatures: { agent: dto.agent } },
        });

        const memoryUsage = await this.getMemoryUsage(dto.agent);

        const features = allFeatures.map(i => {
            return {
                ...omit(i, ['agentFeatures']),
                dailyCost: i.dailyCost,
                enabledAt: i.agentFeatures.getItems()[0]?.createdAt || null,
            };
        });

        const monthlyCost = features.reduce((acc, i) => acc + (i.enabledAt ? +i.price : 0), 0);
        const dailyCost = +((monthlyCost / 30).toFixed(2));
        const balance = await this.agentTransactionsService.getBalance(ref(Agent, dto.agent));

        return {
            features,
            monthlyCost,
            dailyCost,
            memoryUsage,
            balance,
            freeMemoryLimit: 10737418240,
        };
    }

    async enable(dto: ToggleFeatureDto) {
        const isEnabled = await this.agentFeaturesRepo.findOne({ ...dto });
        if (isEnabled) {
            throw new BadRequestException('Опция уже подключена');
        }

        const feature = await this.featuresRepo.findOneOrFail(dto.feature);
        await this.agentTransactionsService.store({
            change: -feature.dailyCost,
            description: 'Подключение опции: ' + feature.title,
            agent: dto.agent,
        });
        this.agentFeaturesRepo.create({ agent: dto.agent, feature });
        await this.agentFeaturesRepo.getEntityManager().flush();
        return this.getInfo({ agent: dto.agent });
    }

    async disable(dto: ToggleFeatureDto) {
        const isEnabled = await this.agentFeaturesRepo.findOne({ ...dto });
        if (!isEnabled) {
            throw new BadRequestException('Опция не подключена');
        }
        await this.agentFeaturesRepo.nativeDelete({ agent: dto.agent, feature: dto.feature });
        return this.getInfo({ agent: dto.agent });
    }
}