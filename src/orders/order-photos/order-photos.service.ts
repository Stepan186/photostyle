import { ForbiddenException, Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { OrderPhoto } from './entities/order-photo.entity';
import { User } from '../../users/entities/user.entity';
import { PriceItem } from '../../prices/entities/price-item.entity';
import { Order } from '../order/entities/order.entity';
import { UpdateOrderPhotoDto } from './dto/update-order-photo.dto';
import { DeleteOrderPhotoDto } from './dto/delete-order-photo.dto';
import { OrdersService } from '../order/orders.service';
import { GetOrderPhotoDto } from './dto/get-order-photo.dto';
import { PhotosService } from '../../photos/photos.service';

@Injectable()
export class OrderPhotosService {
    constructor(
        @InjectRepository(OrderPhoto)
        private repo: EntityRepository<OrderPhoto>,
        @InjectRepository(PriceItem)
        private priceItemRepo: EntityRepository<PriceItem>,
        @InjectRepository(Order)
        private orderRepo: EntityRepository<Order>,
        private ordersService: OrdersService,
        private photosService: PhotosService,
    ) {
    }

    async get(dto: GetOrderPhotoDto, currentUser: User): Promise<OrderPhoto> {
        const item: OrderPhoto = await this.repo.findOneOrFail({
            order: dto.order,
            photo: dto.photo,
            priceItem: dto.priceItem,
        }, { populate: ['order'] });
        if (!currentUser.isAdmin && item.order.user != currentUser) {
            throw new ForbiddenException(403);
        }
        return item;
    }


    async update(
        dto: UpdateOrderPhotoDto,
        currentUser: User,
    ) {
        const order = await this.ordersService.get({ uuid: dto.order }, currentUser);

        this.ordersService.canUpdateItems(order);

        const photo = await this.photosService.get({ id: dto.photo }, currentUser);
        const orderPhoto = order.photos.getItems().find(i => i.photo.id === dto.photo && i.priceItem.id === dto.priceItem);
        const priceItem = await this.priceItemRepo.findOneOrFail({ id: dto.priceItem });

        if (orderPhoto) {
            if (dto.count > 0) {
                orderPhoto.count = dto.count;
            } else {
                order.photos.remove(orderPhoto);
            }
        } else if (dto.count > 0) {
            const sale = order.salePercent ? +priceItem.price * (100 - order.salePercent) / 100 : 0;
            const orderPhoto = this.repo.create({
                count: dto.count,
                photo,
                order,
                priceItem,
                price: priceItem.price - sale,
                sale,
            });
            orderPhoto.photo.populated(true);
            orderPhoto.priceItem.populated(true);
            order.photos.add(orderPhoto);
        }

        this.ordersService.calculatePrices(order);
        this.repo.getEntityManager().flush();

        return order;
    }

    async remove(
        dto: DeleteOrderPhotoDto,
        currentUser: User,
    ) {
        const order = await this.ordersService.get({ uuid: dto.order }, currentUser);

        this.ordersService.canUpdateItems(order);

        const photos = order.photos.getItems().filter(i => {
            return i.order.uuid === dto.order &&
                i.photo.id === dto.photo &&
                (dto.priceItem ? i.priceItem.id === dto.priceItem : true);
        });
        order.photos.remove(photos);
        this.ordersService.calculatePrices(order);
        await this.repo.getEntityManager().flush();
        return order;
    }
}
