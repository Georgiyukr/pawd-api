import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UtilsModule } from "src/utils/utils.module";

@Module({
    imports: [
        UsersModule,
        JwtModule.registerAsync({ useFactory: async () => ({}) }),
        UtilsModule,
    ],
    exports: [AuthService],
    providers: [AuthService, UtilsModule],
    controllers: [AuthController],
})
export class AuthModule {}
