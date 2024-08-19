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
import { Config } from '../../utils/config'
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
        return await this.paymentsService.setupIntent()
    }

    @Delete('/intents/:id')
    async deleteIntent(
        @Param('id') paymentIntentId: string
    ): Promise<CanceledIntentOutputDTO> {
        return await this.paymentsService.deleteIntent()
    }

    @Get('/methods/:id')
    async getPaymentMethods(
        @Param('id') paymentMethodId: string
    ): Promise<any> {
        return await this.paymentsService.getPaymentMethods()
    }

    @Post('/methods')
    async createPaymentMethod(
        @Body(new ValidationPipe()) data: CreatePaymentMethodInputDTO
    ): Promise<PaymentMethodOutputDTO[]> {
        return await this.paymentsService.createPaymentMethod()
    }

    @Post('/methods/default')
    async setDefaultPaymentMethod(
        @Body(new ValidationPipe()) data: PaymentMethodIdDTO
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.setDefaultPaymentMethod()
    }

    @Patch('/methods/default')
    async changeDefaultPaymentMethod(
        @Body(new ValidationPipe()) data: ChangeDefaultPaymentMethod
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.changeDefaultPaymentMethod()
    }

    @Delete('/methods')
    async deletePaymentMethod(
        @Body(new ValidationPipe()) data: DeletePaymentMethodInputDTO
    ): Promise<PaymentMethodOutputDTO> {
        return await this.paymentsService.deletePaymentMethod()
    }
}
