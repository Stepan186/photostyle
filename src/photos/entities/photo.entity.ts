import { BaseEntity, Entity, ManyToOne, OneToOne, OptionalProps, PrimaryKey, Property } from '@mikro-orm/core';
import { Upload } from '../../uploads/entities/upload.entity';
import { Directory } from '../../directories/entities/directory.entity';

@Entity()
export class Photo extends BaseEntity<Photo, 'id'> {
    [OptionalProps]: 'createdAt' | 'updatedAt';

    @PrimaryKey()
    id: number;

    @OneToOne(() => Upload, { owner: true, onDelete: 'cascade' })
    original: Upload;

    @OneToOne(() => Upload, { owner: true, nullable: true, onDelete: 'set null' })
    watermarked?: Upload;

    @ManyToOne(() => Directory, { onDelete: 'no action' })
    directory: Directory;

    @Property()
    createdAt = new Date();

    @Property({ onUpdate: () => new Date() })
    updatedAt = new Date();
}
