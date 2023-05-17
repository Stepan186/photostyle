import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { PhotosController } from './photos.controller';
import { PhotosService } from './photos.service';
import { Photo } from './entities/photo.entity';
import { AuthModule } from '../auth/auth.module';
import { UploadsModule } from '../uploads/uploads.module';
import { DirectoriesModule } from '../directories/directories.module';
import { BullModule } from '@nestjs/bull';
import { WatermarksModule } from '../watermarks/watermarks.module';

@Module({
    imports: [
        BullModule.registerQueue({ name: 'watermark' }),
        MikroOrmModule.forFeature([Photo]),
        AuthModule,
        UploadsModule,
        DirectoriesModule,
        WatermarksModule,
    ],
    exports: [PhotosService],
    controllers: [PhotosController],
    providers: [PhotosService],
})
export class PhotosModule {
}
