import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DirectoriesController } from './directories.controller';
import { DirectoriesService } from './directories.service';
import { Directory } from './entities/directory.entity';
import { PricesModule } from "../prices/prices.module";

@Module({
    imports: [
        MikroOrmModule.forFeature([Directory]),
        PricesModule,
    ],
    exports: [DirectoriesService],
    controllers: [DirectoriesController],
    providers: [DirectoriesService],
})
export class DirectoriesModule {
}
