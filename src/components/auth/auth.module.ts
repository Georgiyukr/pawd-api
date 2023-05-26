import { Module } from "@nestjs/common";
import { AuthController } from "./api/auth.controller";
import { AuthService } from "./domain/auth.service";
import { UsersModule } from "../users/users.module";

@Module({
    imports: [UsersModule],
    exports: [AuthService],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
