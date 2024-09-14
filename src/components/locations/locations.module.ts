import { Module } from '@nestjs/common'
import { DataServicesModule } from 'src/data/data-services.module'
import { UtilsModule } from 'src/utils/utils.module'
import { LocationsService } from './locations.service'
import { LocationsController } from './locations.controller'
import { LocationsRepository } from '../../data/repositories/locations.repository'
import { CommonProvidersModule } from 'src/common/providers/providers.modules'

@Module({
    imports: [DataServicesModule, UtilsModule, CommonProvidersModule],
    exports: [LocationsService],
    providers: [LocationsService, LocationsRepository],
    controllers: [LocationsController],
})
export class LocationsModule {}
