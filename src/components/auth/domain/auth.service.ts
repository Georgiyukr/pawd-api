import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/domain/users.service";
import { CreateUser } from "../../../sharable/types";
import { User } from "../../../sharable/entities";
import { AccessTokenPayload } from "./types";
import { HashService } from "src/utils/hash.service";
import { JwtService } from "./jwt.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService
    ) {}

    async register(data: CreateUser): Promise<any> {
        let user: User = await this.userService.createUser(data);
        const accessTokenPayload: AccessTokenPayload =
            this.jwtService.formatAccessTokenPayload(user.id);
        const refreshTokenPayload = this.jwtService.formatRefreshTokenPayload();
        const accessToken: string = await this.jwtService.generateAccessToken(
            accessTokenPayload
        );
        const refreshToken: string = await this.jwtService.generateRefreshToken(
            refreshTokenPayload
        );

        const refreshTokenHash: string = await this.hashService.makeHash(
            refreshToken
        );
        user = await this.userService.updateUser(
            { email: user.email },
            { refreshToken: refreshTokenHash }
        );

        return {
            user,
            accessToken,
        };
    }
}
