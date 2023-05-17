import {
    BaseEntity,
    Collection,
    Entity,
    ManyToOne,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
    QueryOrder,
} from '@mikro-orm/core';
import { AlbumPage } from './album-page.entity';
import { Project } from '../../../projects/projects/entities/project.entity';
import { Upload } from '../../../uploads/entities/upload.entity';
import { User } from '../../../users/entities/user.entity';

@Entity()
export class Album extends BaseEntity<Album, 'id'> {
    [OptionalProps]: 'createdAt' | 'updatedAt' | 'price';

    @PrimaryKey()
    id: number;

    @Property()
    name: string;

    @ManyToOne(() => Project, { onDelete: 'cascade', nullable: true })
    project?: Project;

    @ManyToOne(() => User)
    owner: User;

    @Property({ type: 'decimal', precision: 7, scale: 2, default: 0, serializer: v => +v })
    price: number;

    @ManyToOne({ eager: true })
    image?: Upload;

    @OneToMany(() => AlbumPage, 'album', {
        orderBy: { ordering: QueryOrder.ASC },
        orphanRemoval: true,
        eager: true,
    })
    pages = new Collection<AlbumPage>(this);

    isAllOrganizerRegionsFilled(): boolean {
        return !this.pages.getItems().some(page =>
            page.regions.getItems().some(region => region.isProtected && !region.photo),
        );
    }

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
