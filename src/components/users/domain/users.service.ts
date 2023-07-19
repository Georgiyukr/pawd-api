import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { CreateUser, NewUser, PaymentCustomer } from "../../../sharable/types";
import { User, UserBuilder } from "../../../sharable/entities";
import { UsersRepository } from "../data/users.repository";
import { HashService } from "../../../utils/hash.service";
import { PaymentsService } from "../../../components/payments/payments.service";

@Injectable()
export class UsersService {
    constructor(
        private usersRepository: UsersRepository,
        private hashService: HashService,
        private paymentsService: PaymentsService
    ) {}
    async createUser(data: CreateUser): Promise<any> {
        let user: User = await this.getUserByEmail(data.email);
        if (user)
            throw new HttpException(
                `User with email ${data.email} already exists.`,
                HttpStatus.CONFLICT
            );
        const hashedPassword = await this.hashService.makeHash(data.password);
        data.password = hashedPassword;

        const paymentCustomer: PaymentCustomer =
            await this.paymentsService.createCustomer({
                email: data.email,
                name: `${data.firstName} ${data.lastName}`,
            });
        user = this.buildNewUser({
            ...data,
            paymentCustomerId: paymentCustomer.id,
        });
        user = await this.usersRepository.createUser(user);

        return user;
    }

    async getUserByEmail(
        email: Lowercase<string>,
        options = undefined
    ): Promise<User> {
        return await this.usersRepository.getUserByEmail(email, options);
    }

    async updateUser(filter, data): Promise<User> {
        return await this.usersRepository.updateUser(filter, data);
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
