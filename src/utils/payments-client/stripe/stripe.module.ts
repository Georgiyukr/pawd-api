import { Module } from '@nestjs/common'
import { StripeService } from './stripe.service'
import { Config } from '../../../utils/config'
import Stripe from 'stripe'

@Module({
    providers: [
        Config,
        {
            provide: Stripe,
            inject: [Config],
            useFactory: (config: Config) => {
                return new Stripe(config.stripeSecretKey, {
                    apiVersion: '2024-06-20',
                    typescript: true,
                })
            },
        },
        StripeService,
    ],
    exports: [StripeService, Stripe],
})
export class StripeModule {}
