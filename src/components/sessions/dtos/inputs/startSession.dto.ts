import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class StartSessionDTO {
    @IsNotEmpty()
    @IsString()
    userId: string

    @IsNotEmpty()
    @IsDate()
    startDate: Date

    @IsNotEmpty()
    @IsNumber()
    startTime: number
}
