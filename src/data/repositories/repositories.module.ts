import { Module } from '@nestjs/common'
import { DataServicesModule } from '../data-services.module'
import { LocationsRepository } from './locations.repository'
import { UsersRepository } from './users.repository'
import { SessionsRepository } from './sessions.repository'
import { FeedbackRepository } from './feedback.repository'

@Module({
    imports: [DataServicesModule],
    exports: [
        LocationsRepository,
        UsersRepository,
        SessionsRepository,
        FeedbackRepository,
    ],
    providers: [
        LocationsRepository,
        UsersRepository,
        SessionsRepository,
        FeedbackRepository,
    ],
})
export class RepositoriesModule {}
