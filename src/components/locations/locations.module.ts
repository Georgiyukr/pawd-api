import { Module } from '@nestjs/common'
import { DataServicesModule } from 'src/data/data-services.module'
import { UtilsModule } from 'src/utils/utils.module'
import { LocationsService } from './locations.service'
import { LocationsController } from './locations.controller'
import { CommonProvidersModule } from '../../common/providers/providers.modules'
import { RepositoriesModule } from '../../data/repositories/repositories.module'

@Module({
    imports: [
        UtilsModule,
        DataServicesModule,
        CommonProvidersModule,
        RepositoriesModule,
    ],
    exports: [LocationsService],
    providers: [LocationsService],
    controllers: [LocationsController],
})
export class LocationsModule {}
