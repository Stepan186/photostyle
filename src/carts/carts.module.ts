import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { CartPhoto } from './cart-photos/entities/cart-photo.entity';
import { PriceItem } from '../prices/entities/price-item.entity';
import { CartPhotosController } from './cart-photos/cart-photos.controller';
import { Cart } from './carts/entities/cart.entity';
import { CartAlbum } from './cart-albums/entities/cart-album.entity';
import { CartAlbumsController } from './cart-albums/cart-albums.controller';
import { CartAlbumsService } from './cart-albums/cart-albums.service';
import { AlbumsModule } from '../albums/albums.module';
import { Album } from '../albums/albums/entities/album.entity';
import { CartsController } from './carts/carts.controller';
import { CartPhotosService } from './cart-photos/cart-photos.service';
import { CartsService } from './carts/carts.service';
import { PricesModule } from '../prices/prices.module';
import { PhotosModule } from '../photos/photos.module';
import { DirectoriesModule } from '../directories/directories.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([CartPhoto, PriceItem, Cart, CartAlbum, Album]),
        AlbumsModule,
        PricesModule,
        PhotosModule,
        DirectoriesModule,
        ProjectsModule,
    ],
    exports: [CartsService],
    controllers: [CartPhotosController, CartAlbumsController, CartsController],
    providers: [CartPhotosService, CartAlbumsService, CartsService],
})

export class CartsModule {
}