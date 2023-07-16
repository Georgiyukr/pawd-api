import { ISendMailOptions, MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { User } from "../../../sharable/entities";
import { EmailService } from "../email.service";
import * as constants from "../constants";

@Injectable()
export class NodeMailerService implements EmailService {
    constructor(private mailerService: MailerService) {}

    sendSuccessfulRegistrationEmail = async (user: User) => {
        const subject = constants.subject.registration;
        const to = user.email;
        const template = constants.templates.registration;
        const context = { firstName: user.firstName };
        await this.sendEmail({ subject, to, template, context });
    };

    sendEmail = async (data: ISendMailOptions) => {
        let email = await this.mailerService.sendMail(data);
        console.log("Nodemailer sent email. MessageId: ", email.messageId);
    };
}
