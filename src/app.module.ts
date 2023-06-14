import { CacheModule, Module, OnModuleInit } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import * as redisStore from 'cache-manager-redis-store';
import { ProjectsModule } from './projects/projects.module';
import { DirectoriesModule } from './directories/directories.module';
import { UploadsModule } from './uploads/uploads.module';
import { PhotosModule } from './photos/photos.module';
import { AlbumsModule } from './albums/albums.module';
import { PricesModule } from './prices/prices.module';
import { PhoneUtilsModule } from './phone-utils/phone-utils.module';
import { NotificationsModule } from './notifications/notifications.module';
import { EmailUtilsModule } from './email-utils/email-utils.module';
import { OrdersModule } from './orders/orders.module';
import { CartsModule } from './carts/carts.module';
import { BullModule } from '@nestjs/bull';
import { WatermarksModule } from './watermarks/watermarks.module';
import { UnloadingsModule } from './unloadings/unloadings.module';
import { ClientsModule } from './clients/clients/clients.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MikroORM } from '@mikro-orm/core';
import { AgentsModule } from './agents/agents.module';
import { ProjectPrepaymentsModule } from './project-prepayments/project-prepayments.module';
import { OrderPaymentsModule } from './order-payments/order-payments.module';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        BullModule.forRoot({
            redis: {
                host: process.env.REDIS_HOST,
                port: +process.env.REDIS_PORT!,
            },
        }),
        MikroOrmModule.forRootAsync({ useFactory: mikroOrmConfig }),
        CacheModule.register({
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
            isGlobal: true,
        }),
        EventEmitterModule.forRoot(),
        UsersModule,
        AuthModule,
        ProjectsModule,
        DirectoriesModule,
        UploadsModule,
        PhotosModule,
        PricesModule,
        AlbumsModule,
        PhoneUtilsModule,
        EmailUtilsModule,
        NotificationsModule,
        OrdersModule,
        CartsModule,
        WatermarksModule,
        UnloadingsModule,
        ClientsModule,
        AgentsModule,
        ProjectPrepaymentsModule,
        OrderPaymentsModule,
    ],
    controllers: [],
    providers: [],
    exports: [],
})
export class AppModule implements OnModuleInit {
    constructor(private readonly orm: MikroORM) {
    }

    async onModuleInit(): Promise<void> {
        try {
            await this.orm.getMigrator().up();
        } catch (e) {
            console.error(e);
        }
    }
}
