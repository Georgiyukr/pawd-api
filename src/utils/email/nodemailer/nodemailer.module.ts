import { Module } from "@nestjs/common";
import { MailerModule } from "@nestjs-modules/mailer";
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { Config } from "../../../utils/config";
import * as path from "path";
import { NodeMailerService } from "./nodemailer.service";

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [Config],
            extraProviders: [Config],
            useFactory: (config: Config) => ({
                transport: {
                    service: "gmail",
                    host: "smtp.gmail.com",
                    auth: {
                        user: config.pawdEmail,
                        pass: config.emailPassword,
                    },
                },
                defaults: { from: config.pawdEmail },
                template: {
                    dir: path.join(__dirname, "..", "templates"),
                    adapter: new HandlebarsAdapter(),
                    options: { strict: true },
                },
            }),
        }),
    ],
    providers: [NodeMailerService],
    exports: [NodeMailerService],
})
export class NodeMailerModule {}
