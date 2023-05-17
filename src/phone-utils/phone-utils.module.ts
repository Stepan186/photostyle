import { Module } from '@nestjs/common';
import { PhoneVerificationService } from './phone-verification.service';
import { SmscService } from './smsc.service';
import { ZvonokService } from './zvonok.service';
import { HttpModule } from '@nestjs/axios';

@Module({
    imports: [HttpModule],
    controllers: [],
    providers: [PhoneVerificationService, SmscService, ZvonokService],
    exports: [PhoneVerificationService, SmscService, ZvonokService],
})
export class PhoneUtilsModule {
}
