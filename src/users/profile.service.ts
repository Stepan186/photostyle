import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { EntityRepository } from '@mikro-orm/postgresql';
import { InjectRepository } from '@mikro-orm/nestjs';
import { CryptoService } from '../auth/auth/crypto.service';
import { PhoneVerificationService } from '../phone-utils/phone-verification.service';
import { EmailVerificationService } from '../email-utils/email-verification.service';
import { omit } from '@1creator/common';
import { GetUserDto } from "./dto/get-user.dto";
import { UpdateAgentDto } from "./dto/update-agent.dto";
import { Agent } from "../agents/agents/entities/agent.entity";

@Injectable()
export class ProfileService {
    constructor(
        @InjectRepository(User)
        public repo: EntityRepository<User>,
        private cryptoService: CryptoService,
        private phoneVerificationService: PhoneVerificationService,
        private emailVerificationService: EmailVerificationService,
    ) {
    }

    async get(dto: GetUserDto): Promise<User> {
        return await this.repo.findOneOrFail(dto,
            { populate: ['image', 'agent.watermark'], cache: 5000 },
        );
    }

    async update(user: User, dto: UpdateProfileDto): Promise<User> {
        if (dto.phone && user.phone !== dto.phone) {
            await this.phoneVerificationService.verifyCode({
                code: dto.phoneVerificationCode,
                phone: dto.phone,
            });
        }

        if (dto.email && user.email !== dto.email) {
            await this.emailVerificationService.verifyCode({
                code: dto.emailVerificationCode!,
                email: dto.email,
            });
        }

        if (dto.password) {
            dto.password = await this.cryptoService.bcrypt(dto.password);
        }

        user.assign(omit(dto, ['emailVerificationCode', 'phoneVerificationCode']));

        await this.repo.getEntityManager().flush();

        await this.repo.populate(user, ['image'], { refresh: true });
        return user;
    }

    async updateAgent(user: User, dto: UpdateAgentDto): Promise<Agent> {
        if (user.agent) {
            user.agent.assign(dto);
        } else {
            user.assign({ agent: dto });
        }

        await this.repo.getEntityManager().flush();

        return user.agent!;
    }
}
