import { Location } from '../../common/entities'

export class CreateLocation {
    locationName: string
    address: string
    city: string
    state: string
    latitude: number
    longitude: number
}

export class GetAllLocations {
    locations: Location[]
    total: number
}

export class UpdateLocationParams {
    locationName?: string
    address?: string
    city?: string
    state?: string
    latitude?: number
    longitude?: number
    locationCode?: number
    occupied?: boolean
    user?: string
    userOpenIntent?: string
    startTime?: number
    startDate?: Date
    sessions?: string[]
    totalUses?: number
    temperature?: number
    soundLevel?: number
    qrCodeImageUrl?: string
}
