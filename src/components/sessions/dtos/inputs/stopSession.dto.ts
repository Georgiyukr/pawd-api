import {
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator'

export class StopSessionDTO {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsDateString()
    stopDate: Date

    @IsNotEmpty()
    @IsNumber()
    stopTime: number
}
