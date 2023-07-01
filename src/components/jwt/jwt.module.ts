import { Module } from "@nestjs/common";
import {
    JwtService as NestJwtService,
    JwtModule as NestJwtModule,
} from "@nestjs/jwt";
import { UtilsModule } from "../../utils/utils.module";
import { Config } from "../../utils/config";
import { JwtService } from "./jwt.service";

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
        NestJwtModule.registerAsync({
            imports: [UtilsModule],
            inject: [Config],
            useFactory: (config: Config) => ({
                privateKey: config.refreshTokenPrivateKey,
                publicKey: config.refreshTokenPublicKey,
                signOptions: {
                    algorithm: config.jwtAlgorithm,
                    expiresIn: config.refreshTokenExpiration,
                    // audience: config.jwtAudience,
                    // issuer: config.jwtIssuer,
                },
                verifyOptions: {
                    algorithms: [config.jwtAlgorithm],
                    // audience: config.jwtAudience,
                    // issuer: config.jwtIssuer,
                },
            }),
        }),
    ],
    providers: [
        JwtService,
        {
            provide: "JWT_ACCCESS_TOKEN_SERVICE",
            // useFactory: () => {
            //     return new NestJwtService();
            // },
            // useExisting: NestJwtService,
            useFactory: (jwtService: NestJwtService) => jwtService,
            inject: [NestJwtService],
        },
        {
            provide: "JWT_REFRESH_TOKEN_SERVICE",
            // useFactory: () => {
            //     return new NestJwtService();
            // },
            // useExisting: NestJwtService,
            useFactory: (jwtService: NestJwtService) => jwtService,
            inject: [NestJwtService],
        },
    ],
    exports: [
        // "JWT_ACCCESS_TOKEN_SERVICE",
        // "JWT_REFRESH_TOKEN_SERVICE",
        JwtService,
    ],
})
export class JwtModule {}
