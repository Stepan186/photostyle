import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { FeaturesService } from './features.service';
import { UpdateFeatureDto } from './dto/update-feature.dto';
import { AdminGuard } from '../../auth/guards/admin.guard';
import { GetFeaturesDto } from './dto/get-features.dto';

@ApiTags('Features')
@UseGuards(AdminGuard)
@Controller('features')
export class FeaturesController {
    constructor(
        private service: FeaturesService,
    ) {
    }

    @Post('/update')
    update(@Body() dto: UpdateFeatureDto) {
        return this.service.update(dto);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetFeaturesDto) {
        return this.service.getMany(dto);
    }
}