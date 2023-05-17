import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AgentFeaturesService } from './agent-features.service';
import { GetFeaturesInfoDto } from './dto/get-features-info.dto';
import { AgentGuard } from '../guards/agent.guard';
import { ToggleFeatureDto } from "./dto/toggle-feature.dto";

@ApiTags('Features')
@UseGuards(AgentGuard)
@Controller('features')
export class AgentFeaturesController {
    constructor(private readonly service: AgentFeaturesService) {
    }

    @Post('getInfo')
    getInfo(@Body() dto: GetFeaturesInfoDto) {
        return this.service.getInfo(dto);
    }

    @Post('enable')
    enable(@Body() dto: ToggleFeatureDto) {
        return this.service.enable(dto);
    }

    @Post('disable')
    disable(@Body() dto: ToggleFeatureDto) {
        return this.service.disable(dto);
    }
}