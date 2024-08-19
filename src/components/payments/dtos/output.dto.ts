import Stripe from 'stripe'

export class PublicKeyOutputDTO {
    publicKey: string
}

export class IntentOutputDTO {
    clientSecret: string
}

export class CanceledIntentOutputDTO {
    canceledIntent: string
}

export class PaymentMethodOutputDTO {
    paymentMethod: Stripe.PaymentMethod
}
