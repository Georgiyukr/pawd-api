import { Module } from '@nestjs/common'
import { MailerModule } from '@nestjs-modules/mailer'
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter'
import * as path from 'path'
import { NodeMailerService } from './nodemailer.service'
import { Config } from '../../../../common/providers/config.service'

@Module({
    imports: [
        MailerModule.forRootAsync({
            inject: [Config],
            extraProviders: [Config],
            useFactory: (config: Config) => ({
                transport: {
                    service: 'gmail',
                    host: 'smtp.gmail.com',
                    auth: {
                        user: config.pawdEmail,
                        pass: config.emailPassword,
                    },
                },
                defaults: { from: config.pawdEmail },
                template: {
                    dir: path.join(__dirname, '..', 'templates'),
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
