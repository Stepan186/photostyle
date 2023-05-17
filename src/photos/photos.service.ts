import { Injectable } from '@nestjs/common';
import { DeletePhotoDto } from './dto/delete-photo.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Photo } from './entities/photo.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { GetPhotoDto } from './dto/get-photo.dto';
import { User } from '../users/entities/user.entity';
import { UploadsService } from '../uploads/uploads.service';
import { StorePhotoDto } from './dto/store-photo.dto';
import { DirectoriesService } from '../directories/directories.service';
import { WatermarksService } from '../watermarks/watermarks.service';
import { ProjectUsersService } from '../projects/project-users/project-users.service';

@Injectable()
export class PhotosService {
    constructor(
        @InjectRepository(Photo)
        private repo: EntityRepository<Photo>,
        private directoriesService: DirectoriesService,
        private uploadsService: UploadsService,
        private watermarksService: WatermarksService,
        private projectUsersService: ProjectUsersService,
    ) {
    }

    // async getMany(dto: GetPhotosDto, currentUser: User) {
    // const where: FilterQuery<Photo> = {};
    // if (dto.id) {
    //     where.id = {
    //         $in: dto.id,
    //     };
    // }
    // const [items, count] = await this.repo.findAndCount(where, {
    //     limit: dto.limit,
    //     offset: dto.offset,
    // });
    // return { items, count };
    // }

    async get(dto: GetPhotoDto, currentUser: User) {
        const res = await this.repo.findOneOrFail({ id: dto.id }, { populate: ['original', 'watermarked', 'directory'] });
        await this.projectUsersService.checkPermissions(res.directory.project, currentUser);
        return res;
    }

    async store(dto: StorePhotoDto, currentUser: User) {
        const directory = await this.directoriesService.get({
            id: dto.directory,
            full: false,
        }, currentUser, 'edit');

        const original = await this.uploadsService.get(dto.upload);

        const photo = this.repo.create({ original, directory: dto.directory });


        if (directory.watermarkOpacity) {
            await this.repo.getEntityManager().flush();
            await this.watermarksService.addWatermarkJob(currentUser, photo, directory.watermarkOpacity);
        } else {
            photo.watermarked = original;
            await this.repo.getEntityManager().flush();
        }

        return photo;
    }

    // async storeBulk(dto: StorePhotosDto, currentUser?: User) {
    //     const photos = [];
    //     const originals = await this.uploadsService.getMany(dto.uploads);
    //     const watermark = await this.getWatermarkBuffer(null, 0.8);
    // for (const original of originals) {
    // const watermarked = await this.overlayWatermark(original, watermark);
    // photos.push(this.repo.create({ original, directory: dto.directory }));
    // }
    // await this.repo.getEntityManager().flush();
    // }

    async remove(
        dto: DeletePhotoDto,
        currentUser: User,
    ): Promise<Photo> {
        const item = await this.get(dto, currentUser);
        const uploads = [item.original];
        if (item.watermarked) {
            uploads.push(item.watermarked);
        }
        await this.uploadsService.removeMany(uploads);
        return item;
    }
}
