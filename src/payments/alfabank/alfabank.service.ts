import { InjectRepository } from '@mikro-orm/nestjs';
import { Payment } from '../entities/payment.entity';
import { EntityRepository } from '@mikro-orm/postgresql';

export class AlfaBankService {
    constructor(
        @InjectRepository(Payment)
        private repo: EntityRepository<Payment>,
    ) {
    }

    async store() {

    }
}