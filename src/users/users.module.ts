import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';
import { ProfileService } from './profile.service';
import { PhoneUtilsModule } from '../phone-utils/phone-utils.module';
import { EmailUtilsModule } from '../email-utils/email-utils.module';

@Module({
    imports: [
        MikroOrmModule.forFeature([User]),
        PhoneUtilsModule,
        EmailUtilsModule,
    ],
    controllers: [UsersController],
    providers: [UsersService, ProfileService],
    exports: [UsersService, ProfileService],
})
export class UsersModule {
}
