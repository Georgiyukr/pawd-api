import { Injectable } from "@nestjs/common";
import { UsersService } from "../../users/domain/users.service";
import { CreateUser } from "../../../sharable/types";
import { User } from "../../../sharable/entities";
import { AccessTokenPayload } from "./types";
import { HashService } from "../../../utils/hash.service";
import { JwtService } from "./jwt.service";
import { EmailService } from "../../../utils/email/email.service";

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
        private readonly emailService: EmailService
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
        await this.emailService.sendSuccessfulRegistrationEmail(user);

        return {
            user,
            accessToken,
        };
    }
}
