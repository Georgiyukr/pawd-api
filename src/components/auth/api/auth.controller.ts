import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    ValidationPipe,
} from "@nestjs/common";
import { AuthService } from "../domain/auth.service";
import { LoginUserInputDTO, RegisterUserInputDTO } from "./dto/inputs";
import {
    LoginUserOutputDTO,
    PasswordResetTokenOutputDTO,
    RegisterUserOutputDTO,
} from "./dto/outputs";
import { EmailInputDTO } from "../../../common/dtos/input";
import { MessageOutputDTO } from "src/common/dtos/output";

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
    async logout(@Param() id: string): Promise<MessageOutputDTO> {
        return await this.authService.logout(id);
    }

    @Post("/password/generate/reset")
    async generatePasswordResetToken(
        @Body(new ValidationPipe())
        emailDTO: EmailInputDTO
    ): Promise<PasswordResetTokenOutputDTO> {
        return await this.authService.generatePasswordResetToken(
            emailDTO.email
        );
    }

    async resetPassword(): Promise<any> {}

    @Post("/username/forgot")
    async forgotUsername(
        @Body(new ValidationPipe())
        emailDto: EmailInputDTO
    ): Promise<MessageOutputDTO> {
        return await this.authService.forgotUsername(emailDto.email);
    }
}
