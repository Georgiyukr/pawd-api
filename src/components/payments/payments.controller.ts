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

@Controller('payments')
export class PaymentsController {
    constructor(
        private readonly paymentsService: PaymentsService,
        private readonly config: Config
    ) {}

    @Get('/key')
    async getPublicKey(): Promise<any> {
        return { key: this.config.stripePublicKey }
    }

    @Post('/intents')
    async setupIntent(
        @Body(new ValidationPipe()) data: UserIdInputDTO
    ): Promise<any> {
        return await this.paymentsService.setupIntent()
    }

    @Delete('/intents/:id')
    async deleteIntent(@Param('id') id: string): Promise<any> {
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
    ): Promise<any> {
        return await this.paymentsService.createPaymentMethod()
    }

    @Post('/methods/default')
    async setDefaultPaymentMethod(
        @Body(new ValidationPipe()) data: PaymentMethodIdDTO
    ): Promise<any> {
        return await this.paymentsService.setDefaultPaymentMethod()
    }

    @Patch('/methods/default')
    async changeDefaultPaymentMethod(
        @Body(new ValidationPipe()) data: ChangeDefaultPaymentMethod
    ): Promise<any> {
        return await this.paymentsService.changeDefaultPaymentMethod()
    }

    @Delete('/methods')
    async deletePaymentMethod(
        @Body(new ValidationPipe()) data: DeletePaymentMethodInputDTO
    ): Promise<any> {
        return await this.paymentsService.deletePaymentMethod()
    }
}
