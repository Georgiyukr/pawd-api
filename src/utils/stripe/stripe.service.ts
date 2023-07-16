import { Injectable } from "@nestjs/common";
import Stripe from "stripe";
import { Config } from "../config";

@Injectable()
export class StripeService {
    stripe: Stripe;
    constructor(private readonly config: Config) {
        this.stripe = new Stripe(this.config.stripeSecretKey, {
            apiVersion: "2022-11-15",
            typescript: true,
        });
    }

    async createCustomer(
        data: Stripe.CustomerCreateParams
    ): Promise<Stripe.Customer> {
        return await this.stripe.customers.create(data);
    }
}
