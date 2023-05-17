import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Upload, UploadedImage } from './entities/upload.entity';
import { EntityRepository } from '@mikro-orm/postgresql';
import { S3 } from 'aws-sdk';
import * as path from 'path';
import { v4 as uuid } from 'uuid';
import sharp from 'sharp';
import { ManagedUpload } from 'aws-sdk/clients/s3';
import * as fs from 'fs';
import { Readable } from 'stream';
import { finished } from 'stream/promises';

@Injectable()
export class UploadsService {
    private readonly s3: S3;

    constructor(
        @InjectRepository(Upload)
        private readonly repo: EntityRepository<Upload>,
    ) {
        this.s3 = new S3({
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
            },
            endpoint: process.env.AWS_ENDPOINT,
        });
    }

    async get(uuid: string): Promise<Upload> {
        return await this.repo.findOneOrFail(uuid);
    }

    async removeMany(uploads: Upload[]): Promise<number> {
        const objectsByBucket: Record<string, { Key: string }[]> = {};

        const addToObjects = (i: Upload | UploadedImage) => {
            if (!objectsByBucket[i.bucket]) {
                objectsByBucket[i.bucket] = [];
            }
            objectsByBucket[i.bucket].push({ Key: i.key });

            if (i instanceof Upload) {
                i.sizes?.forEach(addToObjects);
            }
        };

        uploads.forEach(addToObjects);

        for (const bucket in objectsByBucket) {
            await this.s3.deleteObjects({
                Bucket: bucket,
                Delete: { Objects: objectsByBucket[bucket] },
            }).promise();
        }

        uploads.forEach(i => this.repo.remove(i));
        await this.repo.getEntityManager().flush();
        return 1;
    }

    async getMany(uuid: string[]): Promise<Upload[]> {
        return await this.repo.find(uuid);
    }

    async uploadPublicFile(buffer: Buffer, extension: string) {
        return await this.s3
            .upload({
                Bucket: process.env.AWS_BUCKET!,
                Body: buffer,
                Key: uuid() + extension,
            })
            .promise();
    }

    async create(file: Pick<Express.Multer.File, 'buffer' | 'originalname' | 'size' | 'mimetype'>) {
        const s3Upload = await this.uploadPublicFile(
            file.buffer,
            path.extname(file.originalname),
        );
        const upload = this.repo.create({
            key: s3Upload.Key,
            bucket: s3Upload.Bucket,
            url: s3Upload.Location,
            type: file.mimetype,
            size: file.size,
            name: file.originalname,
            sizes: this.isImage(file.mimetype) ? await this.makeSizesArray(file) : [],
        });

        await this.repo.getEntityManager().persistAndFlush(upload);
        return upload;
    }

    isImage(mimetype: string): boolean {
        return [
            'image/apng',
            'image/bmp',
            'image/gif',
            'image/x-icon',
            'image/jpeg',
            'image/png',
            'image/svg+xml',
            'image/tiff',
            'image/webp',
        ].includes(mimetype);
    }

    async makeSizesArray(
        file: Pick<Express.Multer.File, 'buffer'>,
    ): Promise<Array<UploadedImage>> {
        const img = await sharp(file.buffer);
        const metadata = await img.metadata();
        const maxSize = 300;

        let width: number, height: number;
        if (metadata.width! >= metadata.height!) {
            width = maxSize;
            height = Math.round(metadata.height! * (maxSize / metadata.width!));
        } else {
            height = maxSize;
            width = Math.round(metadata.width! * (maxSize / metadata.height!));
        }

        const img300 = img
            .resize({
                width,
                height,
                fit: 'contain',
            })
            .webp();
        const s3Upload: ManagedUpload.SendData = await this.uploadPublicFile(
            await img300.toBuffer(),
            '.webp',
        );

        return [
            new UploadedImage({
                height,
                width,
                key: s3Upload.Key,
                size: metadata.size!,
                bucket: s3Upload.Bucket,
                url: s3Upload.Location,
            }),
        ];
    }

    async getFileBuffer(url: string) {
        const response = await fetch(url);
        return Buffer.from(await response.arrayBuffer());
    }

    async downloadFile(url: string, path: string): Promise<void> {
        const dirPath = path.split('/').slice(0, -1);
        if (dirPath.length) {
            fs.mkdirSync(dirPath.join('/'), { recursive: true });
        }
        const { body } = await fetch(url);
        const writeStream = fs.createWriteStream(path);
        await finished(Readable.fromWeb(body as any).pipe(writeStream));
    }
}