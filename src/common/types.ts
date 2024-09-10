class Credentials {
    email: Lowercase<string>
    password: string
}

export class CreateUser extends Credentials {
    firstName: string
    lastName: string
    dogName: string
    dogImage?: string
}

export class LoginUser extends Credentials {}

export class NewUser extends CreateUser {
    paymentCustomerId: string
}

export class Message {
    message: string
}
