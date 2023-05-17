import { Process, Processor } from '@nestjs/bull';
import { IWatermarkJob } from './watermark-job.interface';
import { Job } from 'bull';
import { Upload } from '../uploads/entities/upload.entity';
import sharp from 'sharp';
import { UploadsService } from '../uploads/uploads.service';
import { Photo } from '../photos/entities/photo.entity';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';

@Processor('watermark')
export class WatermarksConsumer {
    constructor(
        private uploadsService: UploadsService,
        private orm: MikroORM,
    ) {
    }

    @Process()
    @UseRequestContext()
    async process(job: Job<IWatermarkJob>) {
        const watermarked = await this.overlayWatermark(job.data.photo.original,
            job.data.watermark,
            job.data.photo.directory.watermarkOpacity);
        await this.orm.em.nativeUpdate(Photo, { id: job.data.photo.id }, { watermarked });
    }

    async getWatermarkBuffer(upload: Upload | null, opacity: number) {
        const srcBuffer = await this.uploadsService
            .getFileBuffer(upload?.url || 'https://i.ibb.co/W5Jwbmx/imgonline-com-ua-Resize-ari-YKnw-Suw-ZGTU.png');

        return await sharp(srcBuffer)
            .composite([
                {
                    input: Buffer.from([0, 0, 0, 255 * opacity]),
                    raw: {
                        width: 1,
                        height: 1,
                        channels: 4,
                    },
                    tile: true,
                    blend: 'dest-in',
                },
            ])
            .toBuffer();
    }

    async overlayWatermark(image: Upload, watermark: Upload | null, opacity: number) {
        const watermarkBuffer = await this.getWatermarkBuffer(watermark, opacity);

        const fileBuffer = await this.uploadsService.getFileBuffer(image.url);

        const watermarked = await sharp(fileBuffer)
            .ensureAlpha(0)
            .composite([
                {
                    input: watermarkBuffer,
                    tile: true,
                    top: 0,
                    left: 0,
                },
            ]);

        const metadata = await watermarked.metadata();

        return await this.uploadsService.create({
            buffer: await watermarked.toBuffer(),
            mimetype: image.type,
            originalname: image.name,
            size: metadata.size!,
        });
    }
}
