import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { OrderPhoto } from './order-photos/entities/order-photo.entity';
import { PriceItem } from '../prices/entities/price-item.entity';
import { OrderPhotosController } from './order-photos/order-photos.controller';
import { Order } from './order/entities/order.entity';
import { OrderAlbum } from './order-album/entities/order-album.entity';
import { OrderAlbumsController } from './order-album/order-albums.controller';
import { OrderAlbumsService } from './order-album/order-albums.service';
import { AlbumsModule } from '../albums/albums.module';
import { Album } from '../albums/albums/entities/album.entity';
import { OrdersController } from './order/orders.controller';
import { OrderPhotosService } from './order-photos/order-photos.service';
import { OrdersService } from './order/orders.service';
import { PricesModule } from '../prices/prices.module';
import { PhotosModule } from '../photos/photos.module';
import { DirectoriesModule } from '../directories/directories.module';
import { CartsModule } from '../carts/carts.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([OrderPhoto, PriceItem, Order, OrderAlbum, Album]),
        AlbumsModule,
        PricesModule,
        PhotosModule,
        DirectoriesModule,
        CartsModule,
    ],
    exports: [],
    controllers: [OrderPhotosController, OrderAlbumsController, OrdersController],
    providers: [OrderPhotosService, OrderAlbumsService, OrdersService],
})

export class OrdersModule {
}