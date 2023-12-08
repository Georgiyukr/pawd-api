import { Module } from "@nestjs/common";
import { Config } from "./config";
import { HashService } from "./hash.service";
import { StripeService } from "./stripe/stripe.service";
import { EmailModule } from "./email/email.module";
import { EncryptionService } from "./encryption.service";

@Module({
    imports: [EmailModule],
    exports: [
        Config,
        HashService,
        StripeService,
        EmailModule,
        EncryptionService,
    ],
    providers: [
        Config,
        HashService,
        StripeService,
        EmailModule,
        EncryptionService,
    ],
})
export class UtilsModule {}
