import { Session, User } from '../../common/entities'

export class StartSession {
    userId: string
    startDate: Date
    startTime: number
}

export class StopSession {
    userId: string
    stopTime: number
    stopDate: Date
}

export class StopSessionResponse {
    session: Session
    user: User
}

export class AddImage {
    sessionId: string
    image: string // base64 encoded image string
}

export class SubmitFeedback {
    rating: string
    question1?: string
    question2?: string
    question3?: string
}
