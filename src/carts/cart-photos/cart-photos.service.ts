import { Injectable } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CartPhoto } from './entities/cart-photo.entity';
import { User } from '../../users/entities/user.entity';
import { PriceItem } from '../../prices/entities/price-item.entity';
import { Cart } from '../carts/entities/cart.entity';
import { UpdateCartPhotoDto } from './dto/update-cart-photo.dto';
import { DeleteCartPhotoDto } from './dto/delete-cart-photo.dto';
import { CartsService } from '../carts/carts.service';
import { PhotosService } from '../../photos/photos.service';


@Injectable()
export class CartPhotosService {
    constructor(
        @InjectRepository(CartPhoto)
        private cartPhotoRepo: EntityRepository<CartPhoto>,
        @InjectRepository(PriceItem)
        private priceItemRepo: EntityRepository<PriceItem>,
        @InjectRepository(Cart)
        private cartRepo: EntityRepository<Cart>,
        private cartsService: CartsService,
        private photosService: PhotosService,
    ) {
    }

    async update(
        dto: UpdateCartPhotoDto,
        currentUser: User,
    ) {
        const cart = await this.cartsService.get({ uuid: dto.cart }, currentUser, 'edit');
        const photo = await this.photosService.get({ id: dto.photo }, currentUser);
        const cartPhoto = cart.photos.getItems().find(i => i.photo.id === dto.photo && i.priceItem.id === dto.priceItem);

        if (cartPhoto) {
            cartPhoto.count = dto.count;
        } else if (dto.count >= 0) {
            const newPhoto = this.cartPhotoRepo.create({
                count: dto.count,
                photo,
                priceItem: dto.priceItem,
                cart,
            });
            cart.photos.add(newPhoto);
            await this.cartPhotoRepo.populate(newPhoto, ['priceItem', 'photo.directory.disabledPriceItems']);
        }

        this.cartRepo.getEntityManager().flush();

        return cart;
    }

    async remove(
        dto: DeleteCartPhotoDto,
        currentUser: User,
    ) {
        const cart = await this.cartsService.get({ uuid: dto.cart }, currentUser, 'edit');
        const photos = cart.photos.getItems().filter(i => {
            return i.cart.uuid === dto.cart &&
                i.photo.id === dto.photo &&
                (dto.priceItem ? i.priceItem.id === dto.priceItem : true);
        });
        cart.photos.remove(photos);
        await this.cartRepo.getEntityManager().flush();
        return cart;
    }
}
