import { Controller, Post, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guards/auth.guard';
import { UploadsService } from './uploads.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@ApiTags('Uploads')
@UseGuards(AuthGuard)
@Controller('uploads')
export class UploadsController {
    constructor(private readonly service: UploadsService) {
    }

    @Post('/store')
    @UseInterceptors(FileInterceptor('file'))
    store(@UploadedFile() file: Express.Multer.File) {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        return this.service.create(file);
    }


    // @Post('/update')
    // update(@Body() dto: UpdateProjectDto, @TakeUser() user: User) {
    //   return this.service.update(dto.id, dto, user);
    // }
    //
    // @Post('/remove')
    // remove(@Body() dto: DeleteProjectDto, @TakeUser() user: User) {
    //   return this.service.remove(dto, user);
    // }
}