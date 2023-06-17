import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { UtilsModule } from "src/utils/utils.module";
import { JwtService } from "./domain/jwt.service";

@Module({
    imports: [UsersModule, JwtModule.register({}), UtilsModule],
    exports: [AuthService],
    providers: [AuthService, UtilsModule, JwtService],
    controllers: [AuthController],
})
export class AuthModule {}
