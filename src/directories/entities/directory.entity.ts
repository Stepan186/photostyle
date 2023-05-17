import {
    BaseEntity,
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    OptionalProps,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Project } from '../../projects/projects/entities/project.entity';
import { Photo } from '../../photos/entities/photo.entity';
import { PriceItem } from "../../prices/entities/price-item.entity";

export class DirectoryDetails {
  directoriesCount = 0;
  photosCount = 0;
  size = 0;
}

@Entity()
export class Directory extends BaseEntity<Directory, 'id'> {
  [OptionalProps]: 'createdAt' | 'updatedAt' | 'photos' | 'watermarkOpacity';

  @PrimaryKey()
  id: number;

  @Property()
  name: string;

  @Property({ nullable: true })
  comment?: string;

  @ManyToOne(() => Directory, { nullable: true, onDelete: 'cascade' })
  parent?: Directory;

  @OneToMany(() => Directory, (d) => d.parent)
  directories = new Collection<Directory>(this);

  @Property({ hidden: true })
  treeId?: number;

  @Property({ hidden: true })
  treeLeft?: number;

  @Property({ hidden: true })
  treeRight?: number;

  @Property({ hidden: true })
  treeLevel?: number;

  @ManyToOne(() => Project, { onDelete: 'cascade' })
  project: Project;

  @ManyToMany(() => PriceItem)
  disabledPriceItems = new Collection<PriceItem>(this);

  @OneToMany(() => Photo, p => p.directory)
  photos: Photo[];

  @Property({ default: 0, type: 'float4' })
  watermarkOpacity: number;

  @Property({ persist: false })
  details?: DirectoryDetails = new DirectoryDetails();

  @Property()
  createdAt = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt = new Date();
}
