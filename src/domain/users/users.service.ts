import { Injectable } from "@nestjs/common";
import { CreateUser } from "../types";
import { UsersRepository } from "../../data/repositories/users.repository";

@Injectable()
export class UsersService {
    constructor(private usersRepository: UsersRepository) {}
    async createUser(data: CreateUser): Promise<any> {
        let user = this.getUserByEmail(data.email);
        return data;
    }

    async getUserByEmail(email: Lowercase<string>): Promise<any> {
        return true;
    }
}
