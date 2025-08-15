import { Module } from '@nestjs/common'
import { DataServicesModule } from 'src/data/data-services.module'
import { LocationsService } from './locations.service'
import { LocationsController } from './locations.controller'
import { CommonProvidersModule } from '../../common/providers/providers.modules'
import { RepositoriesModule } from '../../data/repositories/repositories.module'
import { GcpStorageModule } from '../../common/services/gcp/storage/storage.module'

@Module({
    imports: [
        DataServicesModule,
        CommonProvidersModule,
        RepositoriesModule,
        GcpStorageModule,
    ],
    exports: [LocationsService],
    providers: [LocationsService],
    controllers: [LocationsController],
})
export class LocationsModule {}
