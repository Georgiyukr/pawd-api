import { Injectable } from "@nestjs/common";

@Injectable()
export class UsersRepository {
    async getUserByEmail(email: Lowercase<string>): Promise<any> {}
}
