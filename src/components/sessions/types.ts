import { Types } from 'mongoose'

export type StartSession = SessionAction
export type StopSession = SessionAction

export class SessionAction {
    userId: string
    startDate: Date
    startTime: number
}
