import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUser, NewUser } from "../../../sharable/types";
import { User, UserBuilder } from "../../../sharable/entities";
import { UsersRepository } from "../data/users.repository";

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}
    async createUser(data: CreateUser): Promise<any> {
        const userExists: boolean = await this.checkIfUserExistsByEmail(
            data.email
        );
        if (userExists)
            throw new HttpException(
                `User with email ${data.email} already exists.`,
                HttpStatus.CONFLICT
            );
        // hash password
        // create stripe customer
        let paymentCustomerId = "stripe_id_123";
        // build user object
        let user: User = this.buildNewUser({ ...data, paymentCustomerId });
        // create user model and save in Mongo
        user = await this.usersRepository.createUser(user);

        return user;
    }

    async checkIfUserExistsByEmail(email): Promise<boolean> {
        let user: User = await this.usersRepository.getUserByEmail(email);

        if (!user) return false;
        return true;
    }

    buildNewUser(user: NewUser): User {
        let builder: UserBuilder = new UserBuilder();

        const newUser: User = builder
            .setFirstName(user.firstName)
            .setLastName(user.lastName)
            .setEmail(user.email)
            .setPassword(user.password)
            .setDogName(user.dogName)
            .setDogImage(user.dogImage)
            .setPaymentCustomerId(user.paymentCustomerId)
            .getUser();

        return newUser;
    }
}
