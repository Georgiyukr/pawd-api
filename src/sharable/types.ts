import Stripe from "stripe";

class Credentials {
    email: Lowercase<string>;
    password: string;
}

export class CreateUser extends Credentials {
    firstName: string;
    lastName: string;
    dogName: string;
    dogImage?: string;
}

export class LoginUser extends Credentials {}

export class NewUser extends CreateUser {
    paymentCustomerId: string;
}

export type PaymentCustomer = Stripe.Customer;
export type CreatePaymentCustomer = Stripe.CustomerCreateParams;
