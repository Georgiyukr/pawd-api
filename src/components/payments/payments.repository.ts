import { Injectable } from "@nestjs/common";
import { StripeService } from "../../utils/stripe/stripe.service";
import { CreatePaymentCustomer, PaymentCustomer } from "src/sharable/types";

@Injectable()
export class PaymentsRepository {
    constructor(private readonly service: StripeService) {}
    async createCustomer(
        data: CreatePaymentCustomer
    ): Promise<PaymentCustomer> {
        return await this.service.createCustomer(data);
    }
}
