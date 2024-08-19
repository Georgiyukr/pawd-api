import { Controller, Delete, Get, Patch, Post } from '@nestjs/common'
import { PaymentsService } from './payments.service'

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Get('/key')
    async getPublicKey(): Promise<any> {}

    @Post('/setup/intent')
    async setupIntent(): Promise<any> {
        return await this.paymentsService.setupIntent()
    }

    @Post('/payment-methods')
    async getPaymentMethods(): Promise<any> {
        return await this.paymentsService.getPaymentMethods()
    }

    @Post('/payment-methods/created')
    async paymentMethodCreated(): Promise<any> {
        return await this.paymentsService.paymentMethodCreated()
    }

    @Post('/payment-methods/default')
    async setDefaultPaymentMethod(): Promise<any> {
        return await this.paymentsService.setDefaultPaymentMethod()
    }

    @Patch('/payment-methods/default')
    async changeDefaultPaymentMethod(): Promise<any> {
        return await this.paymentsService.changeDefaultPaymentMethod()
    }

    @Delete('/payment-methods')
    async deletePaymentMethod(): Promise<any> {
        return await this.paymentsService.deletePaymentMethod()
    }

    @Delete('/setup/intent')
    async deleteIntent(): Promise<any> {
        return await this.paymentsService.deleteIntent()
    }
}
