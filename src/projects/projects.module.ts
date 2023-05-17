import { Global, Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { ProjectsController } from './projects/projects.controller';
import { ProjectsService } from './projects/projects.service';
import { Project } from './projects/entities/project.entity';
import { ProjectUsersService } from './project-users/project-users.service';
import { ProjectUser } from './project-users/entities/project-user.entity';
import { ProjectUsersController } from './project-users/project-users.controller';
import { AlbumsModule } from '../albums/albums.module';
import { Album } from '../albums/albums/entities/album.entity';
import { PriceList } from '../prices/entities/price-list.entity';
import { UsersModule } from '../users/users.module';
import { ProjectPrepaymentsService } from './projects/project-prepayments.service';
import { ProjectPermission } from './project-permissions/entities/project-permission.entity';
import { ProjectPermissionsService } from './project-permissions/project-permissions.service';

@Global()
@Module({
    imports: [
        MikroOrmModule.forFeature([
            Project,
            ProjectUser,
            Album,
            PriceList,
            ProjectPermission,
        ]),
        AlbumsModule,
        UsersModule,
    ],
    controllers: [ProjectsController, ProjectUsersController],
    providers: [ProjectsService, ProjectUsersService, ProjectPrepaymentsService, ProjectPermissionsService],
    exports: [ProjectsService, ProjectUsersService, ProjectPrepaymentsService],
})
export class ProjectsModule {
}
