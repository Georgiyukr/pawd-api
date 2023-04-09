import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthModule as AuthServiceModule } from "src/domain/auth/auth.module";

@Module({
    imports: [AuthServiceModule],
    providers: [AuthServiceModule],
    controllers: [AuthController],
})
export class AuthModule {}
