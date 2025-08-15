import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class SubmitFeedbackDTO {
    @IsNotEmpty()
    @IsString()
    sessionId: string

    @IsNotEmpty()
    @IsString()
    rating: string

    @IsOptional()
    @IsString()
    question1?: string

    @IsOptional()
    @IsString()
    question2?: string

    @IsOptional()
    @IsString()
    question3?: string
}
