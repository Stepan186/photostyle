import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { AlbumsController } from './albums/albums.controller';
import { AlbumsService } from './albums/albums.service';
import { Album } from './albums/entities/album.entity';
import { AlbumPage } from './albums/entities/album-page.entity';
import { AlbumPageRegion } from './albums/entities/album-page-region.entity';
import { AlbumComposition } from './compositions/entities/album-composition.entity';
import { AlbumCompositionPage } from './compositions/entities/album-composition-page.entity';
import { AlbumCompositionRegion } from './compositions/entities/album-composition-region.entity';
import { PhotosModule } from '../photos/photos.module';
import { AlbumCompositionsController } from './compositions/album-compositions.controller';
import { AlbumCompositionsService } from './compositions/album-compositions.service';

@Module({
    imports: [
        MikroOrmModule.forFeature([
            Album,
            AlbumPage,
            AlbumPageRegion,
            AlbumComposition,
            AlbumCompositionPage,
            AlbumCompositionRegion,
        ]),
        PhotosModule,
    ],
    exports: [AlbumsService],
    controllers: [AlbumsController, AlbumCompositionsController],
    providers: [AlbumsService, AlbumCompositionsService],
})
export class AlbumsModule {
}
