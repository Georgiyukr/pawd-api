import { Injectable } from "@nestjs/common";
import { JwtService as NestJwtService, JwtSignOptions } from "@nestjs/jwt";
import { Config } from "src/utils/config";
import { AccessTokenPayload } from "./types";

@Injectable()
export class JwtService {
    constructor(
        private readonly jwtService: NestJwtService,
        private readonly config: Config
    ) {}

    formatAccessTokenPayload(userId: string): AccessTokenPayload {
        return { userId };
    }

    formatRefreshTokenOptions(userId: string): JwtSignOptions {
        return {
            subject: userId,
            algorithm: this.config.jwtAlgorithm,
            secret: this.config.accessTokenPrivateKey,
            expiresIn: this.config.accessTokenExpiration,
            audience: this.config.jwtAudience,
            issuer: this.config.jwtIssuer,
        };
    }

    async generateToken(payload): Promise<string> {
        return await this.jwtService.signAsync(payload);
    }
}
