import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateLocationInputDTO {
    @IsNotEmpty()
    @IsString()
    locationName: string;

    @IsNotEmpty()
    @IsString()
    address: string;

    @IsNotEmpty()
    @IsString()
    city: string;

    @IsNotEmpty()
    @IsString()
    state: string;

    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;
}
