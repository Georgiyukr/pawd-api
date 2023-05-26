import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/domain/users.service";
import { CreateUser } from "../../../sharable/types";

@Injectable()
export class AuthService {
    constructor(private readonly userService: UsersService) {}
    async register(data: CreateUser): Promise<any> {
        return await this.userService.createUser(data);
    }
}
