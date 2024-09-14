import { Module } from '@nestjs/common'
import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { DataServicesModule } from '../../data/data-services.module'
import { UtilsModule } from '../../utils/utils.module'
import { PaymentsModule } from '../payments/payments.module'
import { RepositoriesModule } from '../../data/repositories/repositories.module'

@Module({
    imports: [
        DataServicesModule,
        UtilsModule,
        PaymentsModule,
        RepositoriesModule,
    ],
    exports: [UsersService],
    providers: [UsersService, PaymentsModule],
    controllers: [UsersController],
})
export class UsersModule {}
