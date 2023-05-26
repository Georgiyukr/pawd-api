export class CreateUser {
    firstName: string;
    lastName: string;
    dogName: string;
    email: Lowercase<string>;
    password: string;
    dogImage?: string;
}

export class NewUser extends CreateUser {
    paymentCustomerId: string;
}
