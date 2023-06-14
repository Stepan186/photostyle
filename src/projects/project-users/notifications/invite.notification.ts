import { BaseNotification } from '../../../notifications/channels/base/base-notification';
import {
    IEmail,
    IEmailNotification,
    IMailNotifiable,
} from '../../../notifications/channels/email/email-notification.channel';
import { ProjectUser } from '../entities/project-user.entity';
import { createMailgen } from '../../../email-utils/helpers/create-mailgen';
import { ProjectRole } from '../entities/project-role.enum';

export class InviteNotification extends BaseNotification implements IEmailNotification {
    projectUser: ProjectUser;

    constructor(projectUser: ProjectUser) {
        super();
        this.projectUser = projectUser;
    }

    via(): string[] {
        return ['mail'];
    }

    public toMail(_notifiable: IMailNotifiable): IEmail {

        const role = this.projectUser.role === ProjectRole.Client ? 'user' : 'agent';

        const email = {
            body: {
                name: this.projectUser.user.fullName,
                intro: 'Вас добавили в проект!',
                action: {
                    instructions: 'Вы можете посмотреть содержимое проекта на странице:',
                    button: {
                        color: '#22BC66',
                        text: 'Перейти в проект',
                        link: `${process.env.FRONTEND_URL}/${role}/projects/get-${this.projectUser.project.id}`,
                    },
                },
                greeting: '👋',
                outro: 'Письмо сгенерировано автоматически. Пожалуйста не отвечайте на него.',
                signature: 'С уважением',
            },
        };
        const html = createMailgen().generate(email);
        return { subject: 'Вы были добавлены в проект', html };
    }

    public toTelegram(_notifiable: any): string {
        return `Уважаемый ${this.projectUser.user.fullName}, ваш заказ №${this.projectUser.user.uuid} создан!`;
    }
}