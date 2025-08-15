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
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    ValidationPipe,
} from '@nestjs/common'
import { PaymentsService } from './payments.service'
import { Config } from '../../common/providers/config.service'
import { UserIdInputDTO } from '../../common/dtos/input'
import {
    ChangeDefaultPaymentMethod,
    CreatePaymentMethodInputDTO,
    DeletePaymentMethodInputDTO,
    PaymentMethodIdDTO,
} from './dtos/input.dto'
import {
    CanceledIntentOutputDTO,
    IntentOutputDTO,
    PaymentMethodOutputDTO,
    PublicKeyOutputDTO,
} from './dtos/output.dto'

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly config: Config
    ) {}

    @Get('/key')
    async getPublicKey(): Promise<PublicKeyOutputDTO> {
        return { publicKey: this.config.stripePublicKey }
    }

    @Post('/intents')
    async setupIntent(
        @Body(new ValidationPipe()) data: UserIdInputDTO
    ): Promise<IntentOutputDTO> {
        return await this.paymentsService.setupIntent(data.userId)
    }

    @Delete('/intents/:id')
    async deleteIntent(
        @Param('id') paymentIntentId: string
    ): Promise<CanceledIntentOutputDTO> {
        return await this.paymentsService.deleteIntent(paymentIntentId)
    }

    @Get('/methods/:id')
    async getPaymentMethods(
        @Param('id') paymentCustomerId: string
    ): Promise<PaymentMethodOutputDTO[]> {
        return await this.paymentsService.getPaymentMethods(paymentCustomerId)
    }

    @Post('/methods')
    async recordPaymentMethod(
        @Body(new ValidationPipe()) data: CreatePaymentMethodInputDTO
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.recordPaymentMethod(data)
    }

    @Post('/methods/default')
    async setDefaultPaymentMethod(
        @Body(new ValidationPipe()) data: PaymentMethodIdDTO
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.setDefaultPaymentMethod(
            data.paymentMethodId
        )
    }

    @Patch('/methods/default')
    async changeDefaultPaymentMethod(
        @Body(new ValidationPipe()) data: ChangeDefaultPaymentMethod
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.changeDefaultPaymentMethod(
            data.paymentCustomerId,
            data.paymentMethodId
        )
    }

    @Delete('/methods')
    async deletePaymentMethod(
        @Body(new ValidationPipe()) data: DeletePaymentMethodInputDTO
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.deletePaymentMethod(data)
    }
}
