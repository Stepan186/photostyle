import { Global, Module } from '@nestjs/common';
import { UploadsController } from './uploads.controller';
import { UploadsService } from './uploads.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Upload } from './entities/upload.entity';

@Global()
@Module({
    imports: [MikroOrmModule.forFeature([Upload])],
    exports: [UploadsService],
    controllers: [UploadsController],
    providers: [UploadsService],
})

export class UploadsModule {
}