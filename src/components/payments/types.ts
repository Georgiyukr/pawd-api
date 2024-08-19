export interface CreatePaymentMethod {
    userId: string
    paymentMethodId: string
    defaultPaymentMethod: boolean
}

export interface DeletePaymentMethod extends CreatePaymentMethod {
    paymentCustomerId: string
}
