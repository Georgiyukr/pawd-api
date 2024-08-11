import { User } from "../../../../../common/entities";

export class LoginUserOutputDTO {
    user: User;
    accessToken: string;
}
