import { IsDefined, IsNotEmpty, IsNumber } from 'class-validator'

export class UserIdInputDTO {
    @IsNotEmpty()
    @IsDefined()
    @IsNumber()
    userId: Number
}
