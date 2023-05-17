import { Unloading } from './entities/unloading.entity';
import { EntityDTO } from '@mikro-orm/core';

export interface IUnloadingJob {
    unloading: EntityDTO<Unloading>;
}