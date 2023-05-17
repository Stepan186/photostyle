import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PricesController } from './prices.controller';
import { PricesService } from './prices.service';
import { PriceList } from './entities/price-list.entity';
import { PriceItem } from './entities/price-item.entity';
import { ProjectPrice } from '../projects/projects/entities/project-price.entity';
import { OrderPhoto } from '../orders/order-photos/entities/order-photo.entity';
import { OrderAlbum } from '../orders/order-album/entities/order-album.entity';
import { PriceItemsService } from "./price-items.service";

@Module({
    imports: [MikroOrmModule.forFeature([PriceList, PriceItem, ProjectPrice, OrderPhoto, OrderAlbum])],
    controllers: [PricesController],
    providers: [PricesService, PriceItemsService],
    exports: [PricesService, PriceItemsService],
})
export class PricesModule {
}
