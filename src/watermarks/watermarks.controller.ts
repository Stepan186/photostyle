import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WatermarksService } from './watermarks.service';

@ApiTags('Watermarks')
@Controller('watermarks')
export class WatermarksController {
    constructor(private readonly service: WatermarksService) {
    }

    @Get('/getJobCount')
    store() {
        return this.service.getJobCount();
    }
}
