import { Injectable } from '@nestjs/common';
import { Project } from './entities/project.entity';

@Injectable()
export class ProjectPrepaymentsService {
    constructor() {
    }

    async isPrepaymentRequired(project: Project) {
        return project.prepayment > 0;
    }
}
