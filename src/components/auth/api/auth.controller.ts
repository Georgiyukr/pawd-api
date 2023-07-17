import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { RegisterUserDTO } from "./dto/Requests/registerUser.dto";
import { AuthService } from "../domain/auth.service";
import { LoginUserDTO } from "./dto/Requests/loginUser.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    async register(
        @Body(new ValidationPipe()) registerUserDto: RegisterUserDTO
    ): Promise<any> {
        return await this.authService.register(registerUserDto);
    }

    @Post("/login")
    async login(
        @Body(new ValidationPipe()) loginUserDto: LoginUserDTO
    ): Promise<any> {
        return await this.authService.login(loginUserDto);
    }
}
