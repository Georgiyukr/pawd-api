import { Global, Module } from '@nestjs/common'
import { PaymentsClientService } from './payments.client.service'
import { StripeModule } from './stripe/stripe.module'
import { StripeService } from './stripe/stripe.service'

@Global()
@Module({
    imports: [StripeModule],
    providers: [
        StripeModule,
        { provide: PaymentsClientService, useClass: StripeService },
    ],
    exports: [PaymentsClientService],
})
export class PaymentsClientModule {}
