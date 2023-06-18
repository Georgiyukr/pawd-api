import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UtilsModule } from "../../utils/utils.module";
import { JwtService } from "./domain/jwt.service";
import { Config } from "../../utils/config";

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({
            imports: [UtilsModule],
            inject: [Config],
            useFactory: async (config: Config) => ({
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
        UtilsModule,
    ],
    exports: [AuthService],
    providers: [AuthService, UtilsModule, JwtService, Config],
    controllers: [AuthController],
})
export class AuthModule {}
