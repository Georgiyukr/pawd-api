import { Location, Session } from "./index";

export class User {
    id?: string;
    firstName: string;
    lastName: string;
    dogName: string;
    paymentCustomerId: string;
    email: Lowercase<string>;
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
    totalUses: number = 0;
}

export interface IUserBuilder {
    reset(): void;
    setFirstName(firstName: string);
    setLastName(lastName: string);
    setDogName(dogName: string);
    setPaymentCustomerId(id: string);
    setEmail(email: string);
    setPassword(password: string);
    setRefreshToken(refreshToken: string);
    setDogImage(image: string);
    setPhoneNumber(phoneNumber: string);
    setOpenedLocation(location: string | Location);
    setLocationInUse(location: string | Location);
    setSocketId(id: string);
    setPaymentSetup(setup: boolean);
    setTotalUses(num: number);
}

export class UserBuilder implements IUserBuilder {
    private user: User;

    constructor() {
        this.reset();
    }

    reset = (): void => {
        this.user = new User();
    };

    setFirstName(firstName: string) {
        this.user.firstName = firstName;
        return this;
    }

    setLastName(lastName: string) {
        this.user.lastName = lastName;
        return this;
    }

    setDogName(dogName: string) {
        this.user.dogName = dogName;
        return this;
    }

    setPaymentCustomerId(id: string) {
        this.user.paymentCustomerId = id;
        return this;
    }

    setEmail(email: Lowercase<string>) {
        this.user.email = email;
        return this;
    }

    setPassword(password: string) {
        this.user.password = password;
        return this;
    }

    setRefreshToken(refreshToken: string) {
        this.user.refreshToken = refreshToken;
        return this;
    }

    setDogImage(image: string) {
        this.user.dogImage = image;
        return this;
    }

    setPhoneNumber(phoneNumber: string) {
        this.user.phoneNumber = phoneNumber;
        return this;
    }

    setOpenedLocation(location: string | Location) {
        this.user.openedLocation = location;
        return this;
    }

    setLocationInUse(location: string | Location) {
        this.user.locationInUse = location;
        return this;
    }

    setSocketId(id: string) {
        this.user.socketId = id;
        return this;
    }

    setPaymentSetup(setup: boolean) {
        this.user.paymentSetup = setup;
        return this;
    }

    setTotalUses(num: number) {
        this.user.totalUses = num;
        return this;
    }

    getUser(): User {
        const builtUser = this.user;
        this.reset();
        return builtUser;
    }
}
