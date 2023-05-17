import { Global, Module } from '@nestjs/common';
import { TelegramController } from '../telegram/telegram.controller';
import { TelegramService } from '../telegram/telegram.service';
import { HttpModule } from '@nestjs/axios';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { User } from '../users/entities/user.entity';

@Global()
@Module({
    imports: [
        HttpModule,
        MikroOrmModule.forFeature([User]),
    ],
    controllers: [TelegramController],
    providers: [TelegramService],
    exports: [TelegramService],
})
export class TelegramModule {
}
