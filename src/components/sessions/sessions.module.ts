import { Module } from '@nestjs/common'
import { SessionsService } from './sessions.service'
import { SessionsController } from './sessions.controller'
import { LocationsModule } from '../locations/locations.module'
import { UsersModule } from '../users/users.module'
import { RepositoriesModule } from '../../data/repositories/repositories.module'
import { DataServicesModule } from '../../data/data-services.module'
import { CommonProvidersModule } from '../../common/providers/providers.modules'
import { GcpStorageModule } from 'src/common/services/gcp/storage/storage.module'

@Module({
    imports: [
        LocationsModule,
        UsersModule,
        RepositoriesModule,
        DataServicesModule,
        CommonProvidersModule,
        GcpStorageModule,
    ],
    exports: [SessionsService],
    providers: [SessionsService],
    controllers: [SessionsController],
})
export class SessionsModule {}
