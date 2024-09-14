import { Module } from '@nestjs/common'
import { DataServicesModule } from '../data-services.module'
import { LocationsRepository } from './locations.repository'
import { UsersRepository } from './users.repository'

@Module({
    imports: [DataServicesModule],
    exports: [LocationsRepository, UsersRepository],
    providers: [LocationsRepository, UsersRepository],
})
export class RepositoriesModule {}
