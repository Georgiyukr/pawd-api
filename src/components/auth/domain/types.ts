import { User } from "../../../sharable/entities";

export interface AccessTokenPayload {
    userId: string;
}

export interface LoggedInUser {
    user: User;
    accessToken: string;
}
