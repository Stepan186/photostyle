import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../users/entities/user.entity';
import { StoreOrderAlbumDto } from './dto/store-order-album.dto';
import { UpdateOrderAlbumDto } from './dto/update-order-album.dto';
import { Order, OrderStatus } from '../order/entities/order.entity';
import { DeleteOrderAlbumDto } from './dto/delete-order-album.dto';
import { OrderAlbum } from './entities/order-album.entity';
import { Album } from '../../albums/albums/entities/album.entity';
import { AlbumsService } from '../../albums/albums/albums.service';
import { OrdersService } from '../order/orders.service';
import { ProjectUsersService } from '../../projects/project-users/project-users.service';
import { ProjectPermissionType } from '../../projects/project-permissions/entities/project-permission.entity';

@Injectable()
export class OrderAlbumsService {
    constructor(
        @InjectRepository(Order)
        private orderRepo: EntityRepository<Order>,
        @InjectRepository(OrderAlbum)
        private repo: EntityRepository<OrderAlbum>,
        @InjectRepository(Album)
        private albumRepo: EntityRepository<Album>,
        private readonly albumsService: AlbumsService,
        private readonly ordersService: OrdersService,
        private projectUsersService: ProjectUsersService,
    ) {
    }

    async get(dto: { id: number }, currentUser: User) {
        const item: OrderAlbum = await this.repo.findOneOrFail(
            { id: dto.id },
            { populate: ['composition.album', 'order'] },
        );
        if (item.order.user != currentUser) {
            await this.projectUsersService.checkPermissions(
                item.composition.album.project!,
                currentUser,
                ProjectPermissionType.ViewOrders,
            );
        }
        return item;
    }

    async store(dto: StoreOrderAlbumDto, currentUser: User) {
        const order = await this.ordersService.get({ uuid: dto.order }, currentUser);

        this.ordersService.canUpdateItems(order);

        const album: Album = await this.albumsService.get({ id: dto.album, project: order.project.id }, currentUser);
        const sale = order.salePercent ? +album.price * (100 - order.salePercent) / 100 : 0;

        const orderAlbum: OrderAlbum = this.repo.create({
            ...dto,
            price: album.price - sale,
            sale,
            composition: { album, owner: currentUser },
        });

        // album.pages.getItems().forEach(page => {
        //     page.regions.getItems().forEach(region => {
        //         orderAlbum.regions.add(new OrderAlbumRegion().assign({ region }));
        //     });
        // });

        order.albums.add(orderAlbum);
        this.ordersService.calculatePrices(order);
        await this.repo.getEntityManager().flush();

        return order;
    }


    async update(
        id: number,
        dto: UpdateOrderAlbumDto,
        currentUser: User,
    ) {
        const item: OrderAlbum = await this.get({ id }, currentUser);
        const order = await this.ordersService.get({ uuid: item.order.uuid }, currentUser);

        if (order.user != currentUser) {
            await this.projectUsersService.checkPermissions(
                order.project,
                currentUser,
                ProjectPermissionType.EditOrders,
            );
        }

        this.ordersService.canUpdateItems(order);

        item.assign(dto);

        this.ordersService.calculatePrices(order);
        await this.repo.getEntityManager().flush();

        return order;
    }

    async remove(dto: DeleteOrderAlbumDto, currentUser: User) {
        const item: OrderAlbum = await this.get({ id: dto.id }, currentUser);
        const order = await this.ordersService.get({ uuid: item.order.uuid }, currentUser);

        if (item.order.status == OrderStatus.Completed) {
            throw new HttpException('Заказ уже завершен', HttpStatus.BAD_REQUEST);
        }

        if (order.user != currentUser) {
            await this.projectUsersService.checkPermissions(
                order.project,
                currentUser,
                ProjectPermissionType.EditOrders,
            );
        }

        await this.repo.getEntityManager().remove(item);
        this.ordersService.calculatePrices(order);
        await this.repo.getEntityManager().flush();

        return this.ordersService.get({ uuid: item.order.uuid }, currentUser);
    }
}
