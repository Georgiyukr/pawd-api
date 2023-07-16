import { Injectable } from "@nestjs/common";
import { User } from "../../../sharable/entities";
import { DataServices } from "../../../data/data-services";

@Injectable()
export class UsersRepository {
    constructor(private dataServices: DataServices) {}

    async createUser(user: User): Promise<User> {
        return await this.dataServices.users.create(user);
    }

    async updateUser(filter, update): Promise<User> {
        return await this.dataServices.users.update(filter, update);
    }

    async getUserById(id: string, options = undefined): Promise<User> {
        return await this.dataServices.users.getById(id, options);
    }

    async getUserByEmail(email: Lowercase<string>): Promise<User> {
        return await this.dataServices.users.getByCondition({ email });
    }
}
