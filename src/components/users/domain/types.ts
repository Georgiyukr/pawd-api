import { Location, Session } from "../../../common/entities";

export class User {
    id?: string;
    firstName?: string;
    lastName?: string;
    dogName?: string;
    paymentCustomerId?: string;
    email?: string;
    password?: string;
    refreshToken?: string;
    passwordResetToken?: string;
    dogImage?: string;
    phoneNumber?: string;
    openedLocation?: string | Location;
    locationInUse?: string | Location;
    sessions?: Session[];
    socketId?: string;
    paymentSetup?: boolean;
    totalUses?: number;
}
