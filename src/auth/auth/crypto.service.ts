import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';

@Injectable()
export class CryptoService {

    async sha256(data: string): Promise<string> {
        return createHash('sha256').update(data).digest('hex');
    }

    async bcrypt(data: string): Promise<string> {
        return bcrypt.hash(data, 10);
    }

    async compareBcrypt(value: string, hashed: string): Promise<boolean> {
        if (!await bcrypt.compare(value, hashed)) {
            throw new Error('invalid hash');
        }
        return true;
    }
}
