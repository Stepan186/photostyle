import { OnQueueCompleted, Process, Processor } from '@nestjs/bull';
import { MikroORM, UseRequestContext } from '@mikro-orm/core';
import { IUnloadingJob } from './unloading-job.interface';
import { Job } from 'bull';
import { Order } from '../orders/order/entities/order.entity';
import * as fs from 'fs/promises';
import archiver from 'archiver';
import { UploadsService } from '../uploads/uploads.service';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Unloading } from './entities/unloading.entity';
import { UnloadingsService } from './unloadings.service';
import { NotificationsService } from '../notifications/notifications.service';
import { UnloadingCompletedNotification } from './notification/unloading-completed.notification';
import { AlbumComposition } from "../albums/compositions/entities/album-composition.entity";


const UNLOADINGS_DIR = '';

@Processor('unloading')
export class UnloadingsConsumer {
    constructor(
        private orm: MikroORM,
        private unloadingsService: UnloadingsService,
        private uploadsService: UploadsService,
        @InjectRepository(Order)
        private ordersRepo: EntityRepository<Order>,
        @InjectRepository(Unloading)
        private unloadingsRepo: EntityRepository<Unloading>,
        private notificationsService: NotificationsService,
    ) {
    }

    @Process()
    @UseRequestContext()
    async process(job: Job<IUnloadingJob>) {
        try {
            const unloading = job.data.unloading;
            const orders = await this.ordersRepo.find({ uuid: unloading.orders.map(i => i.uuid) }, {
                populate: [
                    'albums.composition.regions.photo.original',
                    'albums.composition.regions.region.page',
                    'albums.composition.regions.region.photo',
                    'albums.composition.album.pages.regions.photo.original',
                    'photos.priceItem',
                    'photos.photo.original',
                    'user',
                    'project',
                ],
                populateWhere: { photos: { priceItem: { isElectronic: false } } },
            });
            const date = new Date(unloading.createdAt).toISOString().slice(0, 10);
            const dirPath = `${UNLOADINGS_DIR}/Выгрузка #${unloading.id} ${date}`;
            await this.downloadOrders(orders, dirPath);
            const zipPath = await this.archiveDirToZip(dirPath);
            const size = (await fs.stat(`${dirPath}.zip`)).size;

            const buffer = await fs.readFile(`${dirPath}.zip`);

            const upload = await this.uploadsService.create({
                buffer,
                size,
                mimetype: 'application/zip',
                originalname: `Выгрузка #${unloading.id} ${date}.zip`,
            });

            await fs.rm(dirPath, { recursive: true, force: true });
            await fs.rm(zipPath);

            await this.unloadingsRepo.nativeUpdate({ id: unloading.id }, { upload });
        } catch (e) {
            console.log(e);
        }
    }

    @OnQueueCompleted()
    async onCompleted(job: Job<IUnloadingJob>) {
        const notification = new UnloadingCompletedNotification(job.data.unloading);
        this.notificationsService.notify(job.data.unloading.user, notification);
    }


    async downloadOrders(orders: Order[], rootDirPath: string) {
        for (const order of orders) {
            const path = [rootDirPath, 'Проект ' + order.project.id, order.user.fullName, 'Заказ №' + order.id].join('/');

            // Создаем папки с альбомами
            const albums = order.albums.getItems();
            for (let i = 0; i < albums.length; i++) {
                const albumPath = path + `/Альбом ${albums[i].composition.album.name} ${i}`;
                await this.downloadComposition(albums[i].composition, albumPath);
            }

            // Создание папки с фотками
            for (const orderPhoto of order.photos.getItems()) {
                const photoPath = path + `/Фото/${orderPhoto.priceItem.serviceName}_${orderPhoto.photo.id}.${orderPhoto.photo.original.extension}`;
                await this.uploadsService.downloadFile(orderPhoto.photo.original.url, photoPath);
            }
        }
    }

    async archiveDirToZip(dir: string): Promise<string> {
        const zipPath = `${dir}.zip`;
        const output = (await fs.open(zipPath, 'w+')).createWriteStream();
        const archive = archiver('zip', { zlib: { level: 9 } });
        archive.directory(dir, false).pipe(output);
        const promise = new Promise<string>((resolve, reject) => {
            output.on('close', () => {
                resolve(zipPath);
            });
            output.on('error', reject);
        });
        await archive.finalize();
        return promise;
    }

    async downloadComposition(composition: AlbumComposition, albumPath: string) {
        const albumPages = composition.usedPages;
        // const albumComposRegions = albums[i].composition.regions.getItems();
        // await this.downloadOrganizerPhotos(albumPages, albumPath);

        for (const page of albumPages) {
            for (const region of page.regions) {
                const photo = composition.regions.getItems().find(r => r.region === region)?.photo || region.photo;
                if (!photo) {
                    throw new Error(`Альбом ${composition.id} не заполнен`);
                }
                const originalPhoto = photo.original;
                const fileName = region.page.ordering + '_' + region.safeName + '.' + originalPhoto.extension;
                const path = albumPath + '/' + fileName;
                await this.uploadsService.downloadFile(originalPhoto.url, path);
            }
        }
    }
}