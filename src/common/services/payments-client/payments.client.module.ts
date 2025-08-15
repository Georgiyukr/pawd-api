import { Module } from '@nestjs/common'
import { PaymentsClientService } from './payments.client.service'
import { StripeModule } from './stripe/stripe.module'
import { StripeService } from './stripe/stripe.service'

@Module({
    imports: [StripeModule],
    providers: [
        StripeService,
        { provide: PaymentsClientService, useClass: StripeService },
    ],
    exports: [PaymentsClientService],
})
export class PaymentsClientModule {}
