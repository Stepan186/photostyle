import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { StoreAlbumDto } from './dto/store-album.dto';
import { DeleteAlbumDto } from './dto/delete-album.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { User } from '../../users/entities/user.entity';
import { Album } from './entities/album.entity';
import { AlbumPage } from './entities/album-page.entity';
import { AlbumPageRegion } from './entities/album-page-region.entity';
import { omit } from '@1creator/common';
import { GetAlbumsDto } from './dto/get-albums.dto';
import { GetAlbumDto } from './dto/get-album.dto';
import { SetAlbumRegionPhotoDto } from './dto/set-album-region-photo.dto';
import { PhotosService } from '../../photos/photos.service';
import { ProjectUsersService } from '../../projects/project-users/project-users.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AlbumCompleteEvent } from './events';
import { PaginationDto } from '@1creator/backend';


@Injectable()
export class AlbumsService {
    constructor(
        @InjectRepository(Album)
        private repo: EntityRepository<Album>,
        @InjectRepository(AlbumPage)
        private pagesRepo: EntityRepository<AlbumPage>,
        @InjectRepository(AlbumPageRegion)
        private regionsRepo: EntityRepository<AlbumPageRegion>,
        private readonly photosService: PhotosService,
        private readonly projectUserService: ProjectUsersService,
        private eventEmitter: EventEmitter2,
    ) {
    }

    async getMany(dto: GetAlbumsDto, user: User) {
        const where: FilterQuery<Album> = {
            project: {
                id: dto.project,
                usersPivot: { user },
            },
        };

        const [items, count] = await this.repo.findAndCount(where, {
            populate: ['image', 'pages.regions', 'pages.background', 'project', 'owner'],
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { id: QueryOrder.DESC },
        });

        return { items, count };
    }

    async get(dto: GetAlbumDto, currentUser: User) {
        const where: FilterQuery<Album> = {};

        if (dto.id) {
            where.id = dto.id;
        }

        if (dto.project) {
            where.project = dto.project;
        }

        const album = await this.repo.findOneOrFail(where, {
            populate:
                ['pages.background', 'pages.regions.photo.watermarked', 'project', 'owner'],
        });

        if (album.owner != currentUser) {
            await this.projectUserService.checkPermissions(
                album.project!,
                currentUser,
            );
        }

        return album;

    }

    async getTemplates(dto: PaginationDto, currentUser: User) {
        const [items, count] = await this.repo.findAndCount({
            owner: currentUser,
            project: null,
        }, { populate: ['image', 'pages.regions', 'pages.background', 'project', 'owner'] });
        return { items, count };
    }

    async store(dto: StoreAlbumDto, currentUser: User) {
        const album: Album = this.repo.create({
            name: dto.name,
            owner: currentUser,
            pages: dto.pages.map((p, index) => {
                const page = this.pagesRepo.create({
                    ...p,
                    ordering: index,
                    regions: p.regions.map(r => this.regionsRepo.create(r)),
                });
                page.ordering = index;
                return page;
            }),
        });
        album.image = album.pages.getItems()[0].background;
        await this.repo.getEntityManager().flush();
        await this.repo.populate(album, ['pages.background', 'pages.regions']);
        return album;
    }

    async update(
        dto: UpdateAlbumDto,
        currentUser: User,
    ): Promise<Album> {
        const album = await this.get({ id: dto.id }, currentUser);
        album.assign(dto);

        if (dto.pages) {
            const itemPages = await album.pages.loadItems();
            const newPages = dto.pages.map((p, index) => {
                const page = p.id
                    && itemPages.find(i => i.id === p.id)?.assign(omit(p, ['regions']))
                    || this.pagesRepo.create({
                        ...omit(p, ['id', 'regions']),
                        album,
                        ordering: index,
                    });

                const regions = p.regions.map(r => r.id
                    && page.regions.getItems().find(i => i.id === r.id)?.assign(r)
                    || this.regionsRepo.create({
                        ...omit(r, ['id']),
                        page,
                    }),
                );

                page.ordering = index;
                page.regions.set(regions);

                return page;
            });
            album.pages.set(newPages);
            album.image = album.pages.getItems()[0].background;
        }

        await this.repo.getEntityManager().flush();
        await this.repo.populate(album, ['pages.background', 'pages.regions']);

        if (album.isAllOrganizerRegionsFilled()) {
            const event = new AlbumCompleteEvent().assign({ album });
            this.eventEmitter.emit(AlbumCompleteEvent.name, event);
        }
        return album;
    }

    async remove(
        dto: DeleteAlbumDto,
        currentUser: User,
    ): Promise<Album> {
        const item = await this.get({ id: dto.id }, currentUser);
        await this.repo.getEntityManager().removeAndFlush(item);
        return item;
    }

    async setAlbumProtectedRegionPhoto(dto: SetAlbumRegionPhotoDto, currentUser: User) {
        const album = await this.get({ id: dto.album }, currentUser);
        const region = album.pages.getItems()
            .reduce((acc, page) => acc.concat(page.regions.getItems()), [] as AlbumPageRegion[])
            .find(r => r.id === dto.region);

        if (!region) {
            throw new NotFoundException();
        }

        region.photo = await this.photosService.get({ id: dto.photo }, currentUser);
        await this.regionsRepo.getEntityManager().flush();

        if (album.isAllOrganizerRegionsFilled()) {
            const event = new AlbumCompleteEvent().assign({ album });
            this.eventEmitter.emit(AlbumCompleteEvent.name, event);
        }

        return album;
    }
}
