import { Location, Session } from "./index";

export class User {
    firstName: string;
    lastName: string;
    dogName: string;
    paymentCustomerId: string;
    email: string;
    password: string;
    refreshToken?: string;
    passwordResetToken?: string;
    dogImageBase64?: string;
    phoneNumber?: string;
    openedLocation?: Location;
    locationInUse?: Location;
    sessions?: Session[];
    socketId?: string;
    paymentSetup?: boolean;
    totalUses: number;
}
