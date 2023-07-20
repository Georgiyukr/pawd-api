import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class PasswordResetTokenInputDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    email: Lowercase<string>;
}
