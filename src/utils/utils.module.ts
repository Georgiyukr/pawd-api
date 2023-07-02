import { Module } from "@nestjs/common";
import { Config } from "./config";
import { HashService } from "./hash.service";
import { StripeService } from "./stripe/stripe.service";

@Module({
    imports: [],
    exports: [Config, HashService, StripeService],
    providers: [Config, HashService, StripeService],
})
export class UtilsModule {}
