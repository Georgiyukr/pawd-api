import { Injectable } from "@nestjs/common";
import { CreateUser } from "../types";

@Injectable()
export class AuthService {
    async register(data: CreateUser): Promise<any> {
        return data;
    }
}
