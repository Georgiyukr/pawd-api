import Stripe from 'stripe'

export type CreatePaymentCustomer = Stripe.CustomerCreateParams
export type PaymentCustomer = Stripe.Customer
export type SetupIntent = Stripe.SetupIntent
export type PaymentMethodsList = Stripe.ApiListPromise<Stripe.PaymentMethod>
export type PaymentIntent = Stripe.PaymentIntent
export type PaymentMethodUpdateParams = Stripe.PaymentMethodUpdateParams
export type PaymentMethod = Stripe.PaymentMethod

export type PaymentIntentCharge = {
    amount: Number
    customerId: string
    paymentMethodId: string
}
