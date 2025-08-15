import { SessionOutputDTO } from './session.dto'

export class FeedbackOutputDTO {
    id?: string
    sessionId: string | SessionOutputDTO
    rating: string
    question1?: string
    question2?: string
    question3?: string
}
