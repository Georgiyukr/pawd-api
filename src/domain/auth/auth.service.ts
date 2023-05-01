import { Injectable } from "@nestjs/common";
import { CreateUser } from "../types";
import { UsersService } from "../users/users.service";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}
    async register(data: CreateUser): Promise<any> {
        return await this.userService.createUser(data);
    }
}
