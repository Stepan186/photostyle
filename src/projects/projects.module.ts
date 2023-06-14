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
import { ProjectPermission } from './project-permissions/entities/project-permission.entity';
import { ProjectPermissionsService } from './project-permissions/project-permissions.service';
import { ProjectGroupsController } from "./project-groups/project-groups.controller";
import { ProjectGroupsService } from "./project-groups/project-groups.service";
import { ProjectGroup } from "./project-groups/entities/project-group.entity";

@Global()
@Module({
    imports: [
        MikroOrmModule.forFeature([
            Project,
            ProjectUser,
            Album,
            PriceList,
            ProjectPermission,
            ProjectGroup,
        ]),
        AlbumsModule,
        UsersModule,
    ],
    controllers: [ProjectsController, ProjectUsersController, ProjectGroupsController],
    providers: [ProjectsService, ProjectUsersService, ProjectPermissionsService, ProjectGroupsService],
    exports: [ProjectsService, ProjectUsersService],
})
export class ProjectsModule {
}
