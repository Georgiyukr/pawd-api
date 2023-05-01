export class CreateUser {
    firstName: string;
    lastName: string;
    dogName: string;
    email: Lowercase<string>;
    password: string;
    image?: string;
}
