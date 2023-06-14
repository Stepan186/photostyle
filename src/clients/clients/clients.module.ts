import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ClientsController } from './clients.controller';
import { ClientsService } from './clients.service';
import { User } from '../../users/entities/user.entity';
import { ProjectUser } from '../../projects/project-users/entities/project-user.entity';

@Module({
    imports: [MikroOrmModule.forFeature([User, ProjectUser])],
    exports: [ClientsService],
    controllers: [ClientsController],
    providers: [ClientsService],
})
export class ClientsModule {
}
