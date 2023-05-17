import { MikroORM, RequiredEntityData, UseRequestContext } from '@mikro-orm/core';
import { Feature, FeatureType } from './entites/feature.entity';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';

export const SYSTEM_FEATURES: Array<RequiredEntityData<Feature>> = [
    {
        id: FeatureType.Branding,
        title: 'Брендирование',
        description: 'Возможность добавления собственного водяного знака и логотипа',
        price: 1000,
    },
];

@Injectable()
export class FeaturesService implements OnApplicationBootstrap {
    constructor(
        @InjectRepository(Feature)
        private repo: EntityRepository<Feature>,
        private readonly orm: MikroORM,
    ) {
    }

    @UseRequestContext()
    async onApplicationBootstrap() {
        try {
            await this.syncFeatures();
        } catch (e) {
            console.error(e);
        }
    }

    async syncFeatures() {
        const ids = SYSTEM_FEATURES.map((i) => i.id!);
        await this.repo.nativeDelete({ $not: { id: { $in: ids } } });

        await this.repo
            .createQueryBuilder()
            .insert(SYSTEM_FEATURES)
            .onConflict('id')
            .merge()
            .execute();

        console.log('successfully synced features');
    }

    getMany(dto: { id?: FeatureType[] }): Feature[] {
        const permissions = SYSTEM_FEATURES.map((p) => this.repo.merge(p));
        return dto.id ? permissions.filter(p => dto.id!.includes(p.id)) : permissions;
    }
}