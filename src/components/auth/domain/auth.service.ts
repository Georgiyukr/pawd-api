import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { UsersService } from "../../users/domain/users.service";
import { CreateUser, LoginUser } from "../../../sharable/types";
import { User } from "../../../sharable/entities";
import { AccessTokenPayload, LoggedInUser, RegisteredUser } from "./types";
import { HashService } from "../../../utils/hash.service";
import { JwtService } from "./jwt.service";
import { EmailService } from "../../../utils/email/email.service";

interface Tokens {
    accessToken: string;
    refreshTokenHash: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UsersService,
        private readonly jwtService: JwtService,
        private readonly hashService: HashService,
        private readonly emailService: EmailService
    ) {}

    async register(data: CreateUser): Promise<RegisteredUser> {
        let user: User = await this.userService.createUser(data);
        const { accessToken, refreshTokenHash }: Tokens =
            await this.generateAccessAndRefreshTokens(user);

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

    async login(data: LoginUser): Promise<LoggedInUser> {
        let user: User = await this.userService.getUserByEmail(data.email, {
            select: "-sessions",
        });
        if (!user) {
            throw new HttpException(
                `User with email ${data.email} does not exist.`,
                HttpStatus.NOT_FOUND
            );
        }
        const passwordMatch = await this.hashService.compareToHash(
            data.password,
            user.password
        );

        if (!passwordMatch)
            throw new HttpException(
                "Username or Password provided do not match.",
                HttpStatus.UNAUTHORIZED
            );

        const { accessToken, refreshTokenHash }: Tokens =
            await this.generateAccessAndRefreshTokens(user);

        user = await this.userService.updateUser(
            { email: user.email },
            { refreshToken: refreshTokenHash }
        );

        return {
            user,
            accessToken,
        };
    }

    async logout(id: string): Promise<any> {
        let user = await this.userService.getUserById(id, {
            select: "-sessions -password",
        });
        if (!user) {
            throw new HttpException(
                `User with id ${id} does not exist.`,
                HttpStatus.NOT_FOUND
            );
        }

        user = await this.userService.updateUserById(id, {
            refreshToken: null,
        });
        return { message: "User is logged out." };
    }

    async generateAccessAndRefreshTokens(user: User): Promise<Tokens> {
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
        return { accessToken, refreshTokenHash };
    }
}
