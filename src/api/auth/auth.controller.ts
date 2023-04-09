import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { RegisterUserDTO } from "./dtos/Requests/registerUser.dto";

@Controller("auth")
export class AuthController {
    @Post("/register")
    async register(
        @Body(new ValidationPipe()) registerUserDto: RegisterUserDTO
    ) {
        return registerUserDto;
    }
}
