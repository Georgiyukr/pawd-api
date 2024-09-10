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
import {
    CreatePaymentCustomer,
    PaymentCustomer,
    PaymentIntent,
    PaymentIntentCharge,
    PaymentMethod,
    PaymentMethodsList,
    PaymentMethodUpdateParams,
    SetupIntent,
} from './types'

@Injectable()
export abstract class PaymentsClientService {
    abstract createCustomer(
        customer: CreatePaymentCustomer
    ): Promise<PaymentCustomer>

    abstract createSetupIntent(paymentCustomerId: string): Promise<SetupIntent>
    abstract createPaymentIntent(
        data: PaymentIntentCharge
    ): Promise<PaymentIntent>
    abstract deleteIntent(intentId: string): Promise<SetupIntent>
    abstract getPaymentMethods(
        paymentCustomerId: string
    ): Promise<PaymentMethodsList>
    abstract updatePaymenMethod(
        paymentCustomerId: string,
        params: PaymentMethodUpdateParams
    ): Promise<PaymentMethod>
    abstract detachPaymentMethod(
        paymentMethodId: string
    ): Promise<PaymentMethod>
}
