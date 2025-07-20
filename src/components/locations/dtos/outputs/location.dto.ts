import { Session, User } from '../../../../common/entities'

export class LocationOutputDTO {
    id?: string
    locationName?: string
    locationCode: number
    latitude: number
    longitude: number
    address: string
    city: string
    state: string
    occupied: boolean
    user?: string | User
    userOpenIntent?: string | User
    startTime?: number
    startDate?: Date
    sessions?: string[] | Session[]
    totalUses: number
    temperature?: number
    soundLevel?: number
    qrCodeBase64?: string
}
