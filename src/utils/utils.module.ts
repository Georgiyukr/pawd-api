import { Module } from "@nestjs/common";
import { Config } from "./config";
import { HashService } from "./hash.service";
import { StripeService } from "./stripe/stripe.service";
import { EmailModule } from "./email/email.module";
import { EmailService } from "./email/email.service";

@Module({
    imports: [EmailModule],
    exports: [Config, HashService, StripeService, EmailModule],
    providers: [Config, HashService, StripeService, EmailModule],
})
export class UtilsModule {}
