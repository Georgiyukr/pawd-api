import { Location, User, Feedback } from './index'

export class Session {
    id?: string
    sessionStartTime: Date
    sessionStopTime: Date
    totalTimeInUse: string
    totalPrice: string
    user: string | User
    location: string | Location
    image?: string
    feedback?: string | Feedback
}
