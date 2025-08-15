import { Session, User } from './index'

export class Feedback {
    id?: string
    sessionId: string | Session
    user: string | User
    rating: string
    question1?: string
    question2?: string
    question3?: string
}
