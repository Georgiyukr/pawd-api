import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUser, NewUser } from "../../../sharable/types";
import { User, UserBuilder } from "../../../sharable/entities";
import { UsersRepository } from "../data/users.repository";
import { HashService } from "../../../utils/hash.service";

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private hashService: HashService
    ) {}
    async createUser(data: CreateUser): Promise<any> {
        const userExists: boolean = await this.checkIfUserExistsByEmail(
            data.email
        );
        if (userExists)
            throw new HttpException(
                `User with email ${data.email} already exists.`,
                HttpStatus.CONFLICT
            );
        const hashedPassword = await this.hashService.makeHash(data.password);
        data.password = hashedPassword;

        // create stripe customer
        let paymentCustomerId = "stripe_id_123";
        let user: User = this.buildNewUser({ ...data, paymentCustomerId });
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
