import { User } from '../../../../users/entities/user.entity';

export class CreateNotificationDto {
    users: User[];

    title: string;

    text: string;

    level: number = 0;
}
