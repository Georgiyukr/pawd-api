import { Module } from '@nestjs/common'
import { DataServicesModule } from '../data-services.module'
import { LocationsRepository } from './locations.repository'
import { UsersRepository } from './users.repository'
import { SessionsRepository } from './sessions.repository'

@Module({
    imports: [DataServicesModule],
    exports: [LocationsRepository, UsersRepository, SessionsRepository],
    providers: [LocationsRepository, UsersRepository, SessionsRepository],
})
export class RepositoriesModule {}
