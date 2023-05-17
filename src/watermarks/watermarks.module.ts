import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { BullModule } from '@nestjs/bull';
import { WatermarksService } from './watermarks.service';
import { WatermarksConsumer } from './watermarks.consumer';
import { WatermarksController } from './watermarks.controller';

@Module({
    imports: [
        MikroOrmModule.forFeature([]),
        BullModule.registerQueue({ name: 'watermark' }),
    ],
    exports: [WatermarksService],
    controllers: [WatermarksController],
    providers: [WatermarksService, WatermarksConsumer],
})
export class WatermarksModule {
}
