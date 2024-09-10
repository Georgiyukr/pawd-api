/*
Add terms to your website or app that state how you plan to save payment method 
details and allow customers to opt in.

include a “Save my payment method for future use” checkbox to collect consent.

To charge them when they’re offline, make sure your terms include the following:

1. The customer’s agreement to your initiating a payment or a series of payments on 
their behalf for specified transactions.
2. The anticipated timing and frequency of payments (for example, if the charges 
are for scheduled installments, subscription payments, or unscheduled top-ups).
3. How you determine the payment amount.
4. Your cancellation policy, if the payment method is for a subscription service.

Make sure you keep a record of your customer’s written agreement to these terms.

*/

import { Injectable } from '@nestjs/common'
import Stripe from 'stripe'
import { PaymentsClientService } from '../payments.client.service'

@Injectable()
export class StripeService extends PaymentsClientService {
    constructor(private stripe: Stripe) {
        super()
    }

    async createCustomer(
        data: Stripe.CustomerCreateParams
    ): Promise<Stripe.Customer> {
        return await this.stripe.customers.create(data)
    }

    async createSetupIntent(
        paymentCustomerId: string
    ): Promise<Stripe.SetupIntent> {
        return await this.stripe.setupIntents.create({
            customer: paymentCustomerId,
        })
    }

    async deleteIntent(intentId: string): Promise<Stripe.SetupIntent> {
        return await this.stripe.setupIntents.cancel(intentId)
    }

    async getPaymentMethods(
        paymentCustomerId: string
    ): Promise<Stripe.ApiListPromise<Stripe.PaymentMethod>> {
        return await this.stripe.paymentMethods.list({
            customer: paymentCustomerId,
            type: 'card',
        })
    }

    // no boolean defaultPayment parameter might create a breaking change
    async updatePaymenMethod(
        paymentMethodId: string,
        params: Stripe.PaymentMethodUpdateParams
    ): Promise<Stripe.PaymentMethod> {
        return await this.stripe.paymentMethods.update(paymentMethodId, params)
    }

    async createPaymentIntent(data: any): Promise<Stripe.PaymentIntent> {
        return await this.stripe.paymentIntents.create({
            amount: data.amount,
            currency: 'usd',
            automatic_payment_methods: { enabled: true },
            customer: data.customerId,
            payment_method: data.paymentMethodId,
            off_session: true,
            confirm: true,
        })
    }

    async detachPaymentMethod(
        paymentMethodId: string
    ): Promise<Stripe.PaymentMethod> {
        return await this.stripe.paymentMethods.detach(paymentMethodId)
    }
}
