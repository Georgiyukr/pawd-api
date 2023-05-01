import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { RegisterUserDTO } from "./dtos/Requests/registerUser.dto";
import { AuthService } from "../../domain/auth/auth.service";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    async register(
        @Body(new ValidationPipe()) registerUserDto: RegisterUserDTO
    ): Promise<any> {
        return await this.authService.register(registerUserDto);
    }
}
