import { Body, Controller, Param, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "../domain/auth.service";
import { LoginUserInputDTO, RegisterUserInputDTO } from "./dto/inputs";
import { LoginUserOutputDTO, RegisterUserOutputDTO } from "./dto/outputs";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("/register")
    async register(
        @Body(new ValidationPipe()) registerUserDto: RegisterUserInputDTO
    ): Promise<RegisterUserOutputDTO> {
        return await this.authService.register(registerUserDto);
    }

    @Post("/login")
    async login(
        @Body(new ValidationPipe()) loginUserDto: LoginUserInputDTO
    ): Promise<LoginUserOutputDTO> {
        return await this.authService.login(loginUserDto);
    }

    @Post("/logout/:id")
    async logout(@Param() id: string): Promise<any> {
        return await this.authService.logout(id);
    }
}
