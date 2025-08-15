import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { DataServicesModule } from '../../data/data-services.module'
import { PaymentsModule } from '../payments/payments.module'
import { RepositoriesModule } from '../../data/repositories/repositories.module'
import { CommonProvidersModule } from '../../common/providers/providers.modules'

@Module({
    imports: [
        DataServicesModule,
        PaymentsModule,
        RepositoriesModule,
        CommonProvidersModule,
    ],
    exports: [UsersService],
    providers: [UsersService],
    controllers: [UsersController],
})
export class UsersModule {}
