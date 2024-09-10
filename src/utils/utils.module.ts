import { Module } from '@nestjs/common'
import { Config } from './config'
import { HashService } from './hash.service'
import { EmailModule } from './email/email.module'
import { EncryptionService } from './encryption.service'
import { PaymentsClientModule } from './payments-client/payments.client.module'

@Module({
    imports: [EmailModule],
    exports: [
        Config,
        HashService,
        PaymentsClientModule,
        EmailModule,
        EncryptionService,
    ],
    providers: [
        Config,
        HashService,
        PaymentsClientModule,
        EmailModule,
        EncryptionService,
    ],
})
export class UtilsModule {}
