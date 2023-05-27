import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/domain/users.service";
import { CreateUser } from "../../../sharable/types";
import { User } from "../../../sharable/entities";
import { JwtService } from "@nestjs/jwt";
import { Config } from "../../../utils/config";
import { AccessTokenPayload } from "./types";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly config: Config
    ) {}

    async register(data: CreateUser): Promise<any> {
        let user: User = await this.userService.createUser(data);
        let tokenPayload: AccessTokenPayload = this.formatTokenPayload(user);
        const accessToken: string = await this.generateToken(
            tokenPayload,
            this.config.accessTokenSecret,
            this.config.accessTokenExpiration
        );
        const refreshToken: string = await this.generateToken(
            {},
            this.config.refreshTokenSecret,
            this.config.refreshTokenExpiration
        );

        return user;
    }

    formatTokenPayload(user: User): AccessTokenPayload {
        return {
            id: user.id,
            email: user.email,
            dogName: user.dogName,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    async generateToken(
        payload,
        secret: string,
        expiresIn: string
    ): Promise<string> {
        console.log("Payload", payload);
        return await this.jwtService.signAsync(payload, { secret, expiresIn });
    }

    async generateAccessToken(payload): Promise<string> {
        return await this.jwtService.signAsync(payload, {
            secret: this.config.accessTokenSecret,
            expiresIn: this.config.accessTokenExpiration,
        });
    }
}
