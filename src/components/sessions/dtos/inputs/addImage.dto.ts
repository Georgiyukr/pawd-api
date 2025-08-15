import { IsNotEmpty, IsString, IsBase64 } from 'class-validator'
export class AddImageDTO {
    @IsNotEmpty()
    @IsString()
    sessionId: string

    @IsNotEmpty()
    @IsString()
    @IsBase64()
    image: string // base64 encoded image string
}
