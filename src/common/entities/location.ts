import { User, Session } from './index'

export class Location {
    id?: string
    locationName?: string
    locationCode: number
    latitude: number
    longitude: number
    address: string
    city: string
    state: string
    occupied: boolean
    user?: User
    userOpenIntent?: User
    startTime?: number
    startDate?: Date
    sessions?: Session[]
    totalUses: number
    temperature?: number
    soundLevel?: number
    qrCodeImageUrl?: string
}
