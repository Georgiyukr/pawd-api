import { Global, Module } from "@nestjs/common";
import { NodeMailerModule } from "./nodemailer/nodemailer.module";
import { EmailService } from "./email.service";
import { NodeMailerService } from "./nodemailer/nodemailer.service";

@Global()
@Module({
    imports: [NodeMailerModule],
    providers: [
        NodeMailerModule,
        { provide: EmailService, useClass: NodeMailerService },
    ],
    exports: [EmailService],
})
export class EmailModule {}
