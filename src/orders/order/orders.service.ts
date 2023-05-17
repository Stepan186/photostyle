import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Order, OrderId, OrderStatus } from './entities/order.entity';
import { User } from '../../users/entities/user.entity';
import { StoreOrderDto } from './dto/store-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { FilterQuery, MikroORM, QueryOrder } from '@mikro-orm/core';
import { GetOrderDto } from './dto/get-order.dto';
import { PricesService } from '../../prices/prices.service';
import { DirectoriesService } from '../../directories/directories.service';
import { CartsService } from '../../carts/carts/carts.service';
import { UuidDto } from '@1creator/backend';
import { ProjectRole } from '../../projects/project-users/entities/project-role.enum';
import { GetOrdersDto, UnloadingStatus } from './dto/get-orders.dto';
import { Project } from '../../projects/projects/entities/project.entity';
import { omit } from '@1creator/common';
import { ForbiddenException } from '@nestjs/common';
import { AlbumCompleteEvent, AlbumCompositionCompleteEvent } from '../../albums/albums/events';
import { OnEvent } from '@nestjs/event-emitter';
import { ProjectPermissionType } from '../../projects/project-permissions/entities/project-permission.entity';
import { NotificationsService } from '../../notifications/notifications.service';
import { OrderCreatedUserNotification } from './notifications/order-created-user.notification';
import { OrderCreatedAgentNotification } from "./notifications/order-created-agent.notification";
import { OrderCompletedNotification } from './notifications/order-completed.notification';

export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private repo: EntityRepository<Order>,
        private pricesService: PricesService,
        private readonly directoriesService: DirectoriesService,
        private cartsService: CartsService,
        private orm: MikroORM,
        private notificationsService: NotificationsService,
    ) {
    }

    async getMany(dto: GetOrdersDto, currentUser: User) {
        const where: FilterQuery<Order> = {};
        const populate: string[] = [
            'project.usersPivot.permissions',
            'unloadings',
            'user',
        ];

        if (dto.relations?.includes('items')) {
            populate.push(...[
                'albums.composition.album.image',
                'photos.photo.watermarked',
                'photos.priceItem',
            ]);
        }

        if (dto.uuid) {
            where.uuid = dto.uuid;
        }

        switch (dto.unloadingStatus) {
            case UnloadingStatus.Unloaded:
                where.unloadings = { $exists: true };
                break;
            case UnloadingStatus.NotUnloaded:
                where.unloadings = { $exists: false };
                where.status = [OrderStatus.Work];
                where.shouldUnload = true;
                break;
        }

        if (dto.project) {
            where.project = dto.project;
        }

        if (dto.status) {
            where.status = dto.status;
        }

        if (dto.user) {
            where.user = dto.user;
        }

        if (dto.createdAt?.[0] || dto.createdAt?.[1]) {
            where.createdAt = {
                ...(dto.createdAt[0] ? { $gte: dto.createdAt[0] } : {}),
                ...(dto.createdAt[1] ? { $lte: dto.createdAt[1] } : {}),
            };
        }

        where.$or = [
            { user: currentUser },
            {
                project: {
                    usersPivot: {
                        user: currentUser,
                        role: [ProjectRole.Owner, ProjectRole.Employee],
                    },
                },
            },
        ];

        const [items, count] = await this.repo.findAndCount(where, {
            limit: dto.limit,
            offset: dto.offset,
            orderBy: { createdAt: QueryOrder.DESC },
            populate: populate as never[],
            populateWhere: { project: { usersPivot: { user: currentUser } } },
        });

        items.forEach(i => {
            i.project.currentUser = currentUser;
            if (!i.project.scope?.permissions?.includes(ProjectPermissionType.ViewOrders)) {
                i.unloadings.populated(false);
            }
        });

        return { items, count };
    }

    async get(dto: GetOrderDto, currentUser: User): Promise<Order> {
        const where: FilterQuery<Order> = {};

        if (dto.uuid) {
            where.uuid = dto.uuid;
        }

        if (dto.project) {
            where.project = dto.project;
        }

        const res = await this.repo.findOneOrFail(where, {
            populate: [
                'user',
                'project',
                'project.usersPivot.permissions',
                'albums.composition.album.pages.regions',
                'albums.composition.album.image',
                'albums.composition.regions.photo',
                'albums.composition.regions.region',
                'albums.composition.paidPages.regions',
                'photos.photo.watermarked',
                'photos.priceItem',
            ],
        });

        res.project.currentUser = currentUser;
        if (res.project.scope?.permissions?.includes(ProjectPermissionType.ViewOrders)) {
            await this.repo.populate(res, ['unloadings']);
        }

        try {
            res.activePriceList = await this.pricesService.getProjectActivePriceList(res.project);
        } catch (e) {

        }
        return res;
    }

    async getNextId(project: Project): Promise<OrderId> {
        const lastOrder = await this.repo.findOne({ project }, { orderBy: { createdAt: QueryOrder.desc } });
        if (lastOrder) {
            const split = lastOrder.id.split('-');
            return `${project.id}-${+split[1] + 1}`;
        } else {
            return `${project.id}-1`;
        }
    }

    async store(dto: StoreOrderDto, currentUser: User): Promise<Order> {
        const cart = await this.cartsService.get({ uuid: dto.cart }, currentUser, 'purchase');

        const item = this.repo.create({
            id: await this.getNextId(cart.project),
            shouldUnload: false,
            creator: currentUser,
            project: cart.project,
            user: cart.user,
            comment: cart.comment,
            sale: cart.sale,
            address: cart.address,
            salePercent: cart.salePercent,
            status: OrderStatus.Payment,
            photos: cart.photos.getItems().map(cartPhoto => {
                return {
                    price: cartPhoto.price,
                    sale: cartPhoto.sale,
                    photo: cartPhoto.photo,
                    priceItem: cartPhoto.priceItem,
                    count: cartPhoto.count,
                };
            }),
            albums: cart.albums.getItems().map(cartAlbum => {
                return {
                    price: cartAlbum.price,
                    sale: cartAlbum.sale,
                    composition: cartAlbum.composition,
                    count: cartAlbum.count,
                };
            }),
            total: 0,
        });
        this.calculatePrices(item);

        await this.repo.getEntityManager().flush();

        if (cart.project.scope && ![ProjectRole.Employee, ProjectRole.Owner].includes(cart.project.scope.role)) {
            await cart.project.usersPivot.init({ populate: ['user'] });
            const employees = cart.project.usersPivot.getItems()
                .filter(u => [ProjectRole.Owner, ProjectRole.Employee].includes(u.role))
                .map(u => u.user);

            this.notificationsService.notify(
                employees,
                new OrderCreatedAgentNotification(item),
            );
        }
        this.notificationsService.notify(
            item.user,
            new OrderCreatedUserNotification(item),
        );
        return item;
    }

    async refreshShouldUnload(orders: Order[]) {
        await this.repo.populate(orders, [
            'albums.composition.paidPages',
            'albums.composition.regions',
            'photos.priceItem',
        ]);

        for (const order of orders) {
            const hasRealItem = order.albums.length > 0 || order.photos.getItems().some(p => !p.priceItem.isElectronic);
            const hasUnCompleteAlbum = order.albums.getItems().some(i => i.composition.getErrors(true));
            order.shouldUnload = hasRealItem && !hasUnCompleteAlbum;
        }

        await this.repo.getEntityManager().flush();
    }

    @OnEvent(AlbumCompleteEvent.name)
    async onAlbumComplete({ album }: AlbumCompleteEvent) {
        const orders = await this.repo.find({ albums: { composition: { album: album.id } } });
        await this.refreshShouldUnload(orders);
    }

    @OnEvent(AlbumCompositionCompleteEvent.name)
    async onAlbumCompositionComplete({ composition }: AlbumCompositionCompleteEvent) {
        const orders = await this.repo.find({ albums: { composition: composition.id } });
        await this.refreshShouldUnload(orders);
    }

    calculatePrices(order: Order) {
        const items = [...order.photos.getItems(), ...order.albums.getItems()];
        items.forEach(i => {
            const fullPrice = +i.price + +i.sale;
            i.sale = fullPrice * order.salePercent / 100;
            i.price = fullPrice - i.sale;
        });
        order.sale = items.reduce((acc, i) => acc + i.sale * i.count, 0);
        order.total = items.reduce((acc, i) => acc + i.price * i.count, 0);
    }

    canUpdateItems(order: Order) {
        if ([OrderStatus.Completed, OrderStatus.Work].includes(order.status)) {
            throw new ForbiddenException('Заказ уже завершен');
        }
        return true;
    }

    async update(
        dto: UpdateOrderDto,
        currentUser: User,
    ): Promise<Order> {
        const order = await this.get(dto, currentUser);

        if ([OrderStatus.Work, OrderStatus.Completed].includes(order.status)) {
            dto = omit(dto, ['salePercent']) as UpdateOrderDto;
        }
        const saleChanged = dto.salePercent >= 0 && dto.salePercent !== order.salePercent;
        order.assign(dto);

        if (saleChanged) {
            this.calculatePrices(order);
        }

        if (dto.status === OrderStatus.Completed && !order.completedAt) {
            order.completedAt = new Date();
            this.notificationsService.notify(order.user, new OrderCompletedNotification(order));
        }

        await this.refreshShouldUnload([order]);

        await this.repo.getEntityManager().flush();

        return await this.get(dto, currentUser);
    }

    async remove(
        dto: UuidDto,
        currentUser: User,
    ): Promise<Order> {
        const order = await this.get({ uuid: dto.uuid }, currentUser);
        await this.repo.getEntityManager().removeAndFlush(order);
        return order;
    }
}