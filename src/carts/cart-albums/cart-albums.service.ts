import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { User } from '../../users/entities/user.entity';
import { StoreCartAlbumDto } from './dto/store-cart-album.dto';
import { UpdateCartAlbumDto } from './dto/update-cart-album.dto';
import { Cart } from '../carts/entities/cart.entity';
import { DeleteCartAlbumDto } from './dto/delete-cart-album.dto';
import { CartAlbum } from './entities/cart-album.entity';
import { Album } from '../../albums/albums/entities/album.entity';
import { AlbumsService } from '../../albums/albums/albums.service';
import { CartsService } from '../carts/carts.service';
import { omit } from '@1creator/common';
import { PagesFieldsValidationService } from './helpers/pages-fields-validation.service';

@Injectable()
export class CartAlbumsService {
    constructor(
        @InjectRepository(Cart)
        private orderRepo: EntityRepository<Cart>,
        @InjectRepository(CartAlbum)
        private repo: EntityRepository<CartAlbum>,
        @InjectRepository(Album)
        private albumRepo: EntityRepository<Album>,
        private readonly albumsService: AlbumsService,
        private readonly cartsService: CartsService,
        private readonly pagesFieldsValidationService: PagesFieldsValidationService,
    ) {
    }

    async store(dto: StoreCartAlbumDto, currentUser: User) {
        const cart = await this.cartsService.get({ uuid: dto.cart }, currentUser, 'edit');

        const album = cart.project.albums.getItems().find(a => a.id === dto.album);

        if (!album) {
            throw new NotFoundException();
        }

        const albumPages = album.pages.getItems();

        const compositionFields = this.pagesFieldsValidationService.validateAndFilter(dto.pagesFields, albumPages);

        const cartAlbum = this.repo.create({
            ...dto,
            composition: { album, pagesFields: compositionFields, owner: currentUser },
        });

        cart.albums.add(cartAlbum);
        await this.repo.getEntityManager().flush();

        return cart;
    }


    async update(
        dto: UpdateCartAlbumDto,
        currentUser: User,
    ) {
        const cart = await this.cartsService.get({ uuid: dto.cart }, currentUser, 'edit');
        const cartAlbum = cart.albums.getItems().find(i => i.id === dto.id);

        if (!cartAlbum) {
            throw new NotFoundException();
        }

        cartAlbum.assign(omit(dto, ['composition']));
        if (dto.composition) {
            cartAlbum.composition.assign(dto.composition);
        }
        await this.repo.getEntityManager().flush();

        return cart;
    }

    async remove(
        dto: DeleteCartAlbumDto,
        currentUser: User,
    ) {
        const cart = await this.cartsService.get({ uuid: dto.cart }, currentUser, 'edit');
        const cartAlbum = cart.albums.getItems().find(i => i.id === dto.id);
        if (cartAlbum) {
            cart.albums.remove(cartAlbum);
        }
        await this.repo.getEntityManager().flush();
        return cart;
    }
}
