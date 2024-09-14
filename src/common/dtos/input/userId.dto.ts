import { IsDefined, IsNotEmpty, IsString } from 'class-validator'

export class UserIdInputDTO {
    @IsNotEmpty()
    @IsDefined()
    @IsString()
    userId: string
}
