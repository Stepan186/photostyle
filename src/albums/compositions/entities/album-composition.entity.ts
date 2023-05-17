import {
    BaseEntity,
    Collection,
    Entity,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryKey,
    Property,
} from '@mikro-orm/core';
import { Album } from '../../albums/entities/album.entity';
import { AlbumCompositionRegion } from './album-composition-region.entity';
import { AlbumPageRegion } from '../../albums/entities/album-page-region.entity';
import { User } from '../../../users/entities/user.entity';
import { AlbumPage } from '../../albums/entities/album-page.entity';

@Entity()
export class AlbumComposition extends BaseEntity<AlbumComposition, 'id'> {
    @PrimaryKey()
    id: number;

    @ManyToOne(() => Album, { eager: true })
    album: Album;

    @ManyToOne(() => User)
    owner: User;

    @OneToMany(() => AlbumCompositionRegion, 'composition', { eager: true })
    regions = new Collection<AlbumCompositionRegion>(this);

    @ManyToMany(() => AlbumPage, undefined, { eager: true })
    paidPages = new Collection<AlbumPage>(this);

    get usedPages() {
        const pages = this.album.pages.getItems().filter((page) => !+page.price);
        const filledPaidPages = this.paidPages.getItems().filter((p) => p.regions.getItems().some((r) => !r.isProtected));
        return pages.concat(filledPaidPages);
    }

    @Property({ persist: false })
    get price(): number {
        const pagesPrice = this.usedPages.reduce((acc, page) => acc + +page.price, 0);
        return +this.album.price + pagesPrice;
    }

    @Property({ persist: false })
    get totalRegionsCount() {
        try {
            return this.usedPages?.reduce((acc, page) => acc.concat(page.regions.getItems()), [] as AlbumPageRegion[])
                .filter(i => !i.isProtected).length;
        } catch (e) {
            return undefined;
        }
    }

    @Property({ persist: false })
    get filledRegions() {
        return this.regions.getItems().filter(i => !i.region.isProtected).length;
    }

    getErrors(checkProtected = false) {
        if (
            !this.album.isInitialized()
            || !this.regions.isInitialized()
            || !this.album.pages.isInitialized()
            || (this.album.pages.count() && !this.album.pages[0].regions.isInitialized())
        ) {
            throw new Error('Композиция не инициализирована');
        }

        const pagesErrors = this.usedPages.reduce((pagesErrorsAcc, page, pageIdx) => {
            if (+page.price && !this.regions.getItems().some(r => r.region.page === page)) {
                return pagesErrorsAcc;
            }

            const albumPageRegions = page.regions.getItems();
            const regionsErrors = albumPageRegions.reduce((regionsErrorsAcc, region, regionIdx) => {
                const isRegionFilled = this.regions.getItems().find(r => r.region === region) || region.photo;

                if (!isRegionFilled && (!region.isProtected || checkProtected)) {
                    regionsErrorsAcc[regionIdx] = ['Регион должен содержать фотографию'];
                }

                return regionsErrorsAcc;
            }, {});

            if (Object.keys(regionsErrors).length) {
                pagesErrorsAcc[pageIdx] = { regions: regionsErrors };
            }
            return pagesErrorsAcc;
        }, {});

        if (Object.keys(pagesErrors).length) {
            return { pages: pagesErrors };
        }
    }
}
