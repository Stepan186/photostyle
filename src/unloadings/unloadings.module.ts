import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Unloading } from './entities/unloading.entity';
import { Order } from '../orders/order/entities/order.entity';
import { UnloadingsController } from './unloadings.controller';
import { BullModule } from '@nestjs/bull';
import { UnloadingsConsumer } from './unloadings.consumer';
import { UnloadingsService } from './unloadings.service';
import { UploadsModule } from '../uploads/uploads.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([Unloading, Order]),
        BullModule.registerQueue({ name: 'unloading' }),
        UploadsModule,
    ],
    exports: [],
    controllers: [UnloadingsController],
    providers: [UnloadingsConsumer, UnloadingsService],
})

export class UnloadingsModule {
}