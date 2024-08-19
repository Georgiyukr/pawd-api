import { PaymentsRepository } from './payments.repository'
import { CreatePaymentCustomer, PaymentCustomer } from '../../common/types'
import { CreatePaymentMethod, DeletePaymentMethod } from './types'

export class PaymentsService {
    constructor(private readonly paymentsRepository: PaymentsRepository) {}

    async createCustomer(
        data: CreatePaymentCustomer
    ): Promise<PaymentCustomer> {
        return await this.paymentsRepository.createCustomer(data)
    }

    async setupIntent(userId: Number): Promise<any> {}

    async deleteIntent(paymentId: string): Promise<any> {}

    async getPaymentMethods(paymentCustomerId: string): Promise<any> {}

    async createPaymentMethod(data: CreatePaymentMethod): Promise<any> {}

    async setDefaultPaymentMethod(paymentMethodId: string): Promise<any> {}

    async changeDefaultPaymentMethod(
        paymentCustomerId: string,
        paymentMethodId: string
    ): Promise<any> {}

    async deletePaymentMethod(data: DeletePaymentMethod): Promise<any> {}
}
