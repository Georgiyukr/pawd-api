import { Session, User } from "../../../sharable/entities";

export interface AccessTokenPayload {
    userId: string;
}

export interface LoggedInUser {
    user: User;
    accessToken: string;
}

export interface LogoutMessage {
    message: string;
}

export interface RegisteredUser {
    user: {
        id?: string;
        firstName: string;
        lastName: string;
        dogName: string;
        paymentCustomerId: string;
        email: string;
        sessions?: Session[];
        totalUses: number;
        refreshToken?: string;
    };
    accessToken: string;
}
