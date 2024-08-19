import { PaymentsRepository } from './payments.repository'
import { CreatePaymentCustomer, PaymentCustomer } from '../../common/types'

export class PaymentsService {
    constructor(private readonly paymentsRepository: PaymentsRepository) {}

    async createCustomer(
        data: CreatePaymentCustomer
    ): Promise<PaymentCustomer> {
        return await this.paymentsRepository.createCustomer(data)
    }

    async getPublicKey(): Promise<any> {}

    async setupIntent(): Promise<any> {}

    async getPaymentMethods(): Promise<any> {}

    async paymentMethodCreated(): Promise<any> {}

    async setDefaultPaymentMethod(): Promise<any> {}

    async changeDefaultPaymentMethod(): Promise<any> {}

    async deletePaymentMethod(): Promise<any> {}

    async deleteIntent(): Promise<any> {}
}
