import { Injectable } from "@nestjs/common";
import { User } from "../../sharable/entities";

@Injectable()
export abstract class EmailService {
    sendSuccessfulRegistrationEmail = async (user: User) => {};
    sendUsernameEmail = async (user: User) => {};
}
