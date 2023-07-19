import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class LoginUserInputDTO {
    @IsNotEmpty()
    @IsString()
    @MinLength(8)
    @MaxLength(100)
    email: Lowercase<string>;

    @IsNotEmpty()
    @IsString()
    // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    //     message: "password too weak",
    // })
    password: string;
}
