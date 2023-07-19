import { User } from "../../../../../sharable/entities";

export class LoginUserOutputDTO {
    user: User;
    accessToken: string;
}
