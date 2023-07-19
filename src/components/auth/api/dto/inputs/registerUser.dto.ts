import {
    IsNotEmpty,
    IsString,
    MinLength,
    MaxLength,
    Matches,
    IsOptional,
} from "class-validator";

export class RegisterUserInputDTO {
    @IsNotEmpty()
    @IsString()
    firstName: string;

    @IsNotEmpty()
    @IsString()
    lastName: string;

    @IsNotEmpty()
    @IsString()
    dogName: string;

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

    @IsOptional()
    @IsString()
    dogImage?: string;
}
