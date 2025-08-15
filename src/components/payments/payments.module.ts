import { Module } from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { DataServicesModule } from '../../data/data-services.module'
import { RepositoriesModule } from '../../data/repositories/repositories.module'
import { PaymentsClientModule } from '../../common/services/payments-client/payments.client.module'
import { CommonProvidersModule } from '../../common/providers/providers.modules'

@Module({
    imports: [
        DataServicesModule,
        PaymentsClientModule,
        RepositoriesModule,
        CommonProvidersModule,
    ],
    exports: [PaymentsService],
    providers: [PaymentsService],
    controllers: [PaymentsController],
})
export class PaymentsModule {}
