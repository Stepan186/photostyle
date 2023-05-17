import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { AlbumComposition } from './entities/album-composition.entity';
import { SetRegionPhotoDto } from './dto/set-region-photo.dto';
import { User } from '../../users/entities/user.entity';
import { PhotosService } from '../../photos/photos.service';
import { GetAlbumCompositionDto } from './dto/get-album-composition.dto';
import { AlbumCompositionRegion } from './entities/album-composition-region.entity';
import { AlbumsService } from '../albums/albums.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlbumCompositionCompleteEvent } from '../albums/events';
import { PaidPageDto } from './dto/paid-page.dto';
import { ProjectUsersService } from '../../projects/project-users/project-users.service';
import { ProjectPermissionType } from '../../projects/project-permissions/entities/project-permission.entity';
import { Action } from '../../auth/types/action';


@Injectable()
export class AlbumCompositionsService {
    constructor(
        @InjectRepository(AlbumComposition)
        private repo: EntityRepository<AlbumComposition>,
        @InjectRepository(AlbumCompositionRegion)
        private compositionRegionsRepo: EntityRepository<AlbumCompositionRegion>,
        private projectUsersService: ProjectUsersService,
        private readonly albumService: AlbumsService,
        private photosService: PhotosService,
        private eventEmitter: EventEmitter2,
    ) {
    }

    async get(dto: GetAlbumCompositionDto, currentUser: User, action: Action = 'view') {
        const composition = await this.repo.findOneOrFail({ id: dto.id },
            {
                populate: [
                    'album.pages.background',
                    'album.pages.regions.photo.watermarked',
                    'regions.photo.watermarked',
                    'regions.region',
                    'paidPages.regions',
                    'album.project.usersPivot.permissions',
                    'owner',
                ],
            });

        const permission = action === 'edit' ? ProjectPermissionType.EditOrders : ProjectPermissionType.ViewOrders;
        composition.owner === currentUser || await this.projectUsersService.checkPermissions(
            composition.album.project!,
            currentUser,
            permission,
        );

        return composition;
    }

    async addPaidPage(dto: PaidPageDto, currentUser: User) {
        const composition = await this.get({ id: dto.composition }, currentUser, 'edit');
        const page = composition.album.pages.getItems().find((p) => p.id === dto.page);

        if (!page) {
            throw new NotFoundException();
        }

        await composition.paidPages.add(page);
        await this.repo.getEntityManager().flush();
        return composition;
    }

    async removePaidPage(dto: PaidPageDto, currentUser: User) {
        const composition = await this.get({ id: dto.composition }, currentUser, 'edit');
        const page = composition.paidPages.getItems().find(i => i.id === dto.page);
        if (!page) {
            throw new NotFoundException();
        }
        composition.paidPages.remove(page);

        await this.repo.getEntityManager().flush();
        return composition;
    }

    async setRegionPhoto(dto: SetRegionPhotoDto, currentUser: User) {
        const composition = await this.get({ id: dto.composition }, currentUser, 'edit');
        const photo = await this.photosService.get({ id: dto.photo }, currentUser);
        const region = composition.regions.getItems().find(i => i.region.id === dto.region);
        const isPadePage = composition.album.pages.getItems().find((p) =>
            +p.price && p.regions.getItems().some((r) => r.id === dto.region));

        if (isPadePage && !composition.paidPages.getItems().includes(isPadePage)) {
            throw new ForbiddenException('Необходимо добавить страницу в альбом.');
        }

        if (region) {
            region.photo = photo;
        } else {
            composition.regions.add(this.compositionRegionsRepo.create({
                composition,
                photo,
                region: dto.region,
            }));
        }
        await this.repo.getEntityManager().flush();


        if (!composition.getErrors(true)) {
            const event = new AlbumCompositionCompleteEvent().assign({ composition });
            this.eventEmitter.emit(AlbumCompositionCompleteEvent.name, event);
        }

        return composition;
    }
}
