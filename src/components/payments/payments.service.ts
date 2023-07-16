import { Injectable } from "@nestjs/common";
import { PaymentsRepository } from "./payments.repository";
import { CreatePaymentCustomer, PaymentCustomer } from "../../sharable/types";

@Injectable()
export class PaymentsService {
    constructor(private readonly paymentsRepository: PaymentsRepository) {}

    async createCustomer(
        data: CreatePaymentCustomer
    ): Promise<PaymentCustomer> {
        return await this.paymentsRepository.createCustomer(data);
    }
}
