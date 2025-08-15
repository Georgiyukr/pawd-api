import { LocationOutputDTO } from 'src/components/locations/dtos/outputs'
import { User } from '../../../../common/entities'
import { FeedbackOutputDTO } from './feedback.dto'

export class SessionOutputDTO {
    id?: string
    sessionStartTime: Date
    sessionStopTime: Date
    totalTimeInUse: string
    totalPrice: string
    user: string | User
    location: string | LocationOutputDTO
    image?: string
    feedback?: string | FeedbackOutputDTO
}
