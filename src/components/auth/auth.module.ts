import { Module } from "@nestjs/common";
import {
    JwtService as NestJwtService,
    JwtModule as NestJwtModule,
} from "@nestjs/jwt";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { UsersModule } from "../users/users.module";
import { Config } from "../../utils/config";
import { UtilsModule } from "../../utils/utils.module";
import { JwtService } from "./domain/jwt.service";
import {
    JWT_ACCCESS_TOKEN_SERVICE,
    JWT_REFRESH_TOKEN_SERVICE,
} from "./domain/constants";

@Module({
    imports: [
        NestJwtModule.registerAsync({
            imports: [UtilsModule],
            inject: [Config],
            useFactory: (config: Config) => ({
                privateKey: config.accessTokenPrivateKey,
                publicKey: config.accessTokenPublicKey,
                signOptions: {
                    algorithm: config.jwtAlgorithm,
                    expiresIn: config.accessTokenExpiration,
                    audience: config.jwtAudience,
                    issuer: config.jwtIssuer,
                },
                verifyOptions: {
                    algorithms: [config.jwtAlgorithm],
                    audience: config.jwtAudience,
                    issuer: config.jwtIssuer,
                },
            }),
        }),
    ],
    providers: [
        { provide: JWT_ACCCESS_TOKEN_SERVICE, useExisting: NestJwtService },
    ],
    exports: [JWT_ACCCESS_TOKEN_SERVICE],
})
export class AccessTokenModule {}

@Module({
    imports: [
        NestJwtModule.registerAsync({
            imports: [UtilsModule],
            inject: [Config],
            useFactory: (config: Config) => ({
                privateKey: config.refreshTokenPrivateKey,
                publicKey: config.refreshTokenPublicKey,
                signOptions: {
                    algorithm: config.jwtAlgorithm,
                    expiresIn: config.refreshTokenExpiration,
                    audience: config.jwtAudience,
                    issuer: config.jwtIssuer,
                },
                verifyOptions: {
                    algorithms: [config.jwtAlgorithm],
                    audience: config.jwtAudience,
                    issuer: config.jwtIssuer,
                },
            }),
        }),
    ],
    providers: [
        { provide: JWT_REFRESH_TOKEN_SERVICE, useExisting: NestJwtService },
    ],
    exports: [JWT_REFRESH_TOKEN_SERVICE],
})
export class RefreshTokenModule {}

@Module({
    imports: [UsersModule, UtilsModule, AccessTokenModule, RefreshTokenModule],
    exports: [AuthService],
    providers: [
        AuthService,
        UtilsModule,
        JwtService,
        AccessTokenModule,
        RefreshTokenModule,
    ],
    controllers: [AuthController],
})
export class AuthModule {}
