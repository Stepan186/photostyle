import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { Cart } from './entities/cart.entity';
import { User } from '../../users/entities/user.entity';
import { UpdateCartDto } from './dto/update-cart.dto';
import { GetCartDto } from './dto/get-cart.dto';
import { PricesService } from '../../prices/prices.service';
import { DirectoriesService } from '../../directories/directories.service';
import { StoreCartDto } from './dto/store-cart.dto';
import { createValidationException } from '@1creator/backend';
import { ProjectPrepaymentsService } from '../../projects/projects/project-prepayments.service';
import { Action } from '../../auth/types/action';
import { BadRequestException } from '@nestjs/common';

export type CartAction = Action | 'purchase';

export class CartsService {
    constructor(
        @InjectRepository(Cart)
        private repo: EntityRepository<Cart>,
        private pricesService: PricesService,
        private readonly directoriesService: DirectoriesService,
        private projectPrepaymentsService: ProjectPrepaymentsService,
    ) {
    }

    async get(dto: GetCartDto, currentUser: User, action: CartAction = 'view'): Promise<Cart> {
        const cart = dto.uuid
            ? await this.repo.findOneOrFail({ uuid: dto.uuid })
            : await this.getOrCreate({ project: dto.project! }, currentUser);

        await this.repo.populate(cart,
            [
                'user',
                'project.usersPivot',
                'project.albums.image',
                'project.albums.pages.regions',
                'albums.composition.album.pages.regions',
                'albums.composition.album.image',
                'albums.composition.regions.photo',
                'albums.composition.paidPages.regions',
                'albums.composition.regions.region',
                'photos.photo.watermarked',
                'photos.priceItem',
            ],
        );

        if (action === 'purchase') {
            this.validate(cart);
        }

        cart.project.currentUser = currentUser;
        try {
            cart.activePriceList = await this.pricesService.getProjectActivePriceList(cart.project);
        }catch (e) {

        }

        return cart;
    }

    async getOrCreate(dto: { project: number }, user: User): Promise<Cart> {
        try {
            return await this.repo.findOneOrFail({
                project: dto.project,
                user,
            });
        } catch (e) {
            const cart = this.repo.create({
                project: dto.project,
                user,
            });
            await this.repo.getEntityManager().flush();
            return cart;
        }
    }

    async store(
        dto: StoreCartDto,
        currentUser: User,
    ): Promise<Cart> {
        const cart = await this.repo.create({
            project: dto.project,
            user: currentUser,
        });
        await this.repo.getEntityManager().flush();
        return cart;
    }

    async update(
        dto: UpdateCartDto,
        currentUser: User,
    ): Promise<Cart> {
        const cart = await this.get(dto, currentUser, 'edit');
        cart.assign(dto);
        await this.repo.getEntityManager().flush();
        return await this.get(dto, currentUser);
    }

    validate(cart: Cart) {
        if (!cart.photos.length && !cart.albums.length) {
            throw new BadRequestException('В корзине пусто');
        }

        const errors = cart.getErrors();

        if (errors) {
            throw createValidationException({ cart: errors } as any);
        }
    }
}