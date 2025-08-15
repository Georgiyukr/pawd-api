import {
    IsDate,
    IsDateString,
    IsNotEmpty,
    IsNumber,
    IsString,
} from 'class-validator'

export class StartSessionDTO {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsDateString()
    startDate: Date

    @IsNotEmpty()
    @IsNumber()
    startTime: number
}
