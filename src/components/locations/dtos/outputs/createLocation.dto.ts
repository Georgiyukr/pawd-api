import { Session } from '../../../../common/entities'

export class CreateLocationOutputDTO {
    id?: string
    locationName?: string
    locationCode?: number
    address?: string
    city?: string
    state?: string
    latitude?: number
    longitude?: number
    occupied?: boolean
    sessions?: string[] | Session[]
    totalUses?: number
    qrCodeBase64?: string
}
