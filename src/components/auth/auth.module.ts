import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { UsersModule } from "../users/users.module";
import { UtilsModule } from "../../utils/utils.module";
import { JwtModule } from "../jwt/jwt.module";

@Module({
    imports: [UsersModule, UtilsModule, JwtModule],
    exports: [AuthService],
    providers: [AuthService, UtilsModule, JwtModule],
    controllers: [AuthController],
})
export class AuthModule {}
