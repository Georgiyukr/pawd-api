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

    formatAccessTokenOptions(userId: string): JwtSignOptions {
        return {
            subject: userId,
            algorithm: this.config.jwtAlgorithm,
            secret: this.config.accessTokenPrivateKey,
            expiresIn: this.config.accessTokenExpiration,
            audience: this.config.jwtAudience,
            issuer: this.config.jwtIssuer,
        };
    }

    generateToken(payload, options: JwtSignOptions): string {
        return this.jwtService.sign(payload, options);
    }
}
