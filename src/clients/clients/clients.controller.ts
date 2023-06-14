import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { GetClientsDto } from './dto/get-clients.dto';
import { ApiTags } from '@nestjs/swagger';
import { User } from '../../users/entities/user.entity';
import { GetClientDto } from './dto/get-client.dto';
import { AuthGuard } from '../../auth/guards/auth.guard';
import { TakeUser } from '@1creator/backend';

@ApiTags('Clients')
@UseGuards(AuthGuard)
@Controller('clients')
export class ClientsController {
    constructor(private readonly service: ClientsService) {
    }

    @Post('/get')
    get(@Body() dto: GetClientDto, @TakeUser() user: User) {
        return this.service.get(dto, user);
    }

    @Post('/getMany')
    getMany(@Body() dto: GetClientsDto, @TakeUser() user: User) {
        return this.service.getMany(dto, user);
    }
}
