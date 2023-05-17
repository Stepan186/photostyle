import { JwtService as NestJwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { IJwtTokens } from './interfaces/jwt-tokens.interface';
import { Inject, Injectable, Request, UnauthorizedException } from '@nestjs/common';
import { IDeviceDataMeta } from './interfaces/device-data.interface';
import { User } from '../../users/entities/user.entity';
import { RefreshTokenMeta } from './entities/refresh-token-meta.entity';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository } from '@mikro-orm/postgresql';
import { IJwtPayload } from './interfaces/jwt-payload.interface';
import { v4 as generateUuid } from 'uuid';
import { CryptoService } from '../auth/crypto.service';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ProfileService } from "../../users/profile.service";

const UNKNOWN = 'unknown';
const REFRESH_LIVE_MILLISECONDS = 1000 * 60 * 60 * 24 * 30; // 30 Дней
const ACCESS_LIVE_MINUTES = 300;

@Injectable()
export class JwtService extends NestJwtService {
    constructor(
        @Inject(ProfileService)
        private readonly profileService: ProfileService,
        @InjectRepository(RefreshTokenMeta)
        private repo: EntityRepository<RefreshTokenMeta>,
        private cryptoService: CryptoService,
    ) {
        super({ secret: String(process.env.SECRET_KEY) });
    }

    async getUserByJwt(token: string) {
        const data = await this.verify<IJwtPayload>(token);
        return await this.profileService.get({ uuid: data.user.uuid });
    }

    async createTokens({ deviceIp, deviceName }: IDeviceDataMeta, user: User): Promise<IJwtTokens> {
        const uuid = generateUuid();

        const accessToken = this.sign({
            uuid,
            user: { uuid: user.uuid },
        },
        { expiresIn: 60 * ACCESS_LIVE_MINUTES });
        const refreshToken = generateUuid();

        /*
    * всегда создаем новый токен, т.к. у нас мало данных для определения device
    * */
        this.repo.create({
            uuid,
            user,
            deviceName,
            deviceIp,
            expiresAt: new Date(+new Date() + REFRESH_LIVE_MILLISECONDS),
            refreshToken: await this.cryptoService.sha256(refreshToken),
        });
        await this.repo.getEntityManager().flush();

        return { accessToken, refreshToken };
    }

    async revokeRefreshToken(accessToken: string) {
        try {
            const payload = this.verify<IJwtPayload>(accessToken);
            await this.repo.nativeDelete({ uuid: payload.uuid });
        } catch (e) {
            console.log(e);
        }
    }

    async generateDeviceData(req: Request): Promise<IDeviceDataMeta> {
        return {
            deviceName: req.headers['user-agent'] || UNKNOWN,
            deviceIp: req.headers['x-real-ip'] || UNKNOWN,
        };
    }

    async refreshToken(dto: RefreshTokenDto, deviceData: IDeviceDataMeta) {
        try {
            const refreshToken = await this.cryptoService.sha256(dto.refreshToken);
            const refreshTokenMeta = await this.repo.findOneOrFail({
                refreshToken,
                expiresAt: { $gt: new Date() },
            });

            const user = await this.profileService.get({ uuid: refreshTokenMeta.user.uuid });
            await this.repo.remove(refreshTokenMeta);

            const tokens = await this.createTokens(deviceData, user);
            return { user, tokens };
        } catch (e) {
            throw new UnauthorizedException();
        }
    }
}