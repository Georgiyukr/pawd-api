import {
    IsArray,
    IsBoolean,
    IsDate,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
} from "class-validator";

export class UpdateLocationInputDTO {
    @IsNotEmpty()
    @IsString()
    @IsOptional()
    locationName?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    address?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    city?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    state?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    latitude?: number;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    longitude?: number;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    locationCode?: number;

    @IsNotEmpty()
    @IsBoolean()
    @IsOptional()
    occupied?: boolean;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    user?: string;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    userOpenIntent?: string;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    startTime?: number;

    @IsNotEmpty()
    @IsDate()
    @IsOptional()
    startDate?: Date;

    @IsNotEmpty()
    @IsArray()
    @IsOptional()
    sessions?: string[];

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    totalUses?: number;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    temperature?: number;

    @IsNotEmpty()
    @IsNumber()
    @IsOptional()
    soundLevel?: number;

    @IsNotEmpty()
    @IsString()
    @IsOptional()
    qrCodeBase64?: string;
}
