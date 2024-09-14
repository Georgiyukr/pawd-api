import { Module } from '@nestjs/common'
import { Config } from './config'
import { HashService } from './hash.service'
import { EmailModule } from './email/email.module'
import { EncryptionService } from './encryption.service'
import { PaymentsClientModule } from './payments-client/payments.client.module'

@Module({
    imports: [EmailModule, PaymentsClientModule],
    exports: [
        PaymentsClientModule,
        EmailModule,
        Config,
        HashService,
        EncryptionService,
    ],
    providers: [Config, HashService, EncryptionService],
})
export class UtilsModule {}
