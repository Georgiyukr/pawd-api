import {
    ConflictException,
    HttpException,
    HttpStatus,
    Injectable,
} from "@nestjs/common";
import { CreateUser, NewUser, PaymentCustomer } from "../../../common/types";
import { User, UserBuilder } from "../../../common/entities";
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
    async createUser(data: CreateUser): Promise<User> {
        let user: User = await this.getUserByEmail(data.email);
        if (user)
            throw new ConflictException(
                `User with email ${data.email} already exists.`
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

    async getUserById(id: string, options = undefined): Promise<User> {
        return await this.usersRepository.getUserById(id, options);
    }

    async updateUser(filter, data): Promise<User> {
        return await this.usersRepository.updateUser(filter, data);
    }

    async updateUserById(id: string, data): Promise<User> {
        return await this.usersRepository.updateUserById(id, data);
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
