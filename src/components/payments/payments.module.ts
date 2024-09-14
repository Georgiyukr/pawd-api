import { Module } from '@nestjs/common'
import { UtilsModule } from '../../utils/utils.module'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'
import { PaymentsClientModule } from '../../utils/payments-client/payments.client.module'
import { UsersRepository } from '../../data/repositories/users.repository'
import { DataServicesModule } from '../../data/data-services.module'

@Module({
    imports: [UtilsModule, DataServicesModule, PaymentsClientModule],
    providers: [PaymentsService, UsersRepository],
    exports: [PaymentsService],
    controllers: [PaymentsController],
})
export class PaymentsModule {}
