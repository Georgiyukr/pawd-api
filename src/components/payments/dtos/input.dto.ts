import { IsDefined, IsNotEmpty, IsBoolean, IsString } from 'class-validator'

export class PaymentMethodIdDTO {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    paymentMethodId: string
}

export class ChangeDefaultPaymentMethod extends PaymentMethodIdDTO {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    paymentCustomerId: string
}

export class CreatePaymentMethodInputDTO extends PaymentMethodIdDTO {
    @IsDefined()
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsDefined()
    @IsBoolean()
    defaultPaymentMethod: boolean
}

export class DeletePaymentMethodInputDTO extends CreatePaymentMethodInputDTO {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    paymentCustomerId: string
}
