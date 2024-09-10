import { Module } from '@nestjs/common'
import { UtilsModule } from '../../utils/utils.module'
import { PaymentsService } from './payments.service'
import { PaymentsController } from './payments.controller'

@Module({
    imports: [UtilsModule],
    providers: [UtilsModule, PaymentsService],
    exports: [PaymentsService],
    controllers: [PaymentsController],
})
export class PaymentsModule {}
