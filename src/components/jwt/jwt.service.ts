import { Inject, Injectable } from "@nestjs/common";
import { JwtService as NestJwtService } from "@nestjs/jwt";
import { AccessTokenPayload } from "../auth/domain/types";

@Injectable()
export class JwtService {
    constructor(
        @Inject("JWT_ACCCESS_TOKEN_SERVICE")
        private readonly jwtAccessTokenService: NestJwtService,
        @Inject("JWT_REFRESH_TOKEN_SERVICE")
        private readonly jwtRefreshTokenService: NestJwtService
    ) {}

    formatAccessTokenPayload(userId: string): AccessTokenPayload {
        return { userId };
    }

    formatRefreshTokenPayload() {
        return {};
    }

    async generateAccessToken(payload): Promise<string> {
        // console.log(this.jwtAccessTokenService);
        return await this.jwtAccessTokenService.signAsync(payload);
    }

    async generateRefreshToken(payload): Promise<string> {
        console.log(this.jwtRefreshTokenService);
        return await this.jwtRefreshTokenService.signAsync(payload);
    }
}
