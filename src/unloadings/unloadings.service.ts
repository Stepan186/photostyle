import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Unloading } from './entities/unloading.entity';
import { StoreUnloadingDto } from './dto/store-unloading.dto';
import { User } from '../users/entities/user.entity';
import { Order, OrderStatus } from '../orders/order/entities/order.entity';
import { UploadsService } from '../uploads/uploads.service';
import { FilterQuery, QueryOrder } from '@mikro-orm/core';
import { ProjectRole } from '../projects/project-users/entities/project-role.enum';
import { PaginationDto } from '@1creator/backend';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IUnloadingJob } from './unloading-job.interface';
import { BadRequestException } from '@nestjs/common';


export class UnloadingsService {
    constructor(
        @InjectRepository(Order)
        private ordersRepo: EntityRepository<Order>,
        @InjectRepository(Unloading)
        private repo: EntityRepository<Unloading>,
        private readonly uploadsService: UploadsService,
        @InjectQueue('unloading')
        private unloadingQueue: Queue<IUnloadingJob>,
    ) {
    }

    async getMany(dto: PaginationDto, currentUser: User) {
        const where: FilterQuery<Unloading> = {user: currentUser};

        const [items, count] = await this.repo.findAndCount(where, {
            populate: ['orders', 'upload'],
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { id: QueryOrder.DESC },
        });
        return { items, count };
    }

    async store(dto: StoreUnloadingDto, currentUser: User) {
        const where: FilterQuery<Order> = {
            status: OrderStatus.Work,
            $or: [
                { user: currentUser },
                {
                    project: {
                        usersPivot: {
                            user: currentUser,
                            role: [ProjectRole.Owner, ProjectRole.Employee],
                        },
                    },
                },
            ],
        };

        if (dto.orders.length) {
            where.uuid = dto.orders;
        } else {
            where.shouldUnload = true;
        }

        const orders = await this.ordersRepo.find(where, {
            populate: [
                'albums.composition.regions.photo.original',
                'albums.composition.regions.region.page',
                'albums.composition.regions.region.photo',
                'albums.composition.paidPages.regions.photo',
                'albums.composition.album.pages.regions.photo.original',
                'photos.priceItem',
                'photos.photo.original',
                'user',
                'project',
            ],
        });

        const errors = orders.reduce((orderErrorsAcc, order, orderIdx) => {
            if (!order.shouldUnload) {
                orderErrorsAcc[orderIdx] = ['Заказ собран не до конца'];
            }
            return orderErrorsAcc;
        }, {});

        if (Object.keys(errors).length) {
            throw new BadRequestException({ message: 'Один из заказов имеет несобранный альбом' });
        } else if (!orders.length) {
            throw new BadRequestException({ message: 'Нет доступных заказов для выгрузки' });
        }

        const totalCost = orders.reduce((acc, i) => acc + +i.total, 0);
        const unloading = this.repo.create({ orders, user: currentUser, totalCost });

        await this.repo.getEntityManager().flush();
        await this.unloadingQueue.add({ unloading: unloading.toJSON() });
        return unloading;
    }
}



