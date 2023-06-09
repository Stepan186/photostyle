import { Injectable } from '@nestjs/common';
import { UploadsService } from '../uploads/uploads.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { User } from '../users/entities/user.entity';
import { Photo } from '../photos/entities/photo.entity';
import { IWatermarkJob } from './watermark-job.interface';
import { FeatureType } from "../agents/agent-features/entites/feature.entity";

@Injectable()
export class WatermarksService {
    constructor(
        private uploadsService: UploadsService,
        @InjectQueue('watermark')
        private watermarkQueue: Queue<IWatermarkJob>,
    ) {
    }

    async addWatermarkJob(user: User, photo: Photo, opacity: number) {
        await user.agent?.init();
        await user.agent?.watermark?.init();
        await user.agent?.features.init();

        const watermark = user.agent?.hasFeature(FeatureType.Branding) && user.agent?.watermark
            ? user.agent.watermark
            : null;

        await this.watermarkQueue.add({
            photo,
            watermark,
            opacity,
        });
    }

    async getJobCount() {
        return {
            active: await this.watermarkQueue.getActiveCount(),
            waiting: await this.watermarkQueue.getWaitingCount(),
            completed: await this.watermarkQueue.getCompletedCount(),
            paused: await this.watermarkQueue.getPausedCount(),
            failed: await this.watermarkQueue.getFailedCount(),
        };
    }
}
