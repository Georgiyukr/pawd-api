import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { CreateLocation, GetAllLocations, UpdateLocationParams } from './types'
import { Location } from '../../common/entities'
import { LocationsRepository } from '../../data/repositories/locations.repository'
import * as QRcode from 'qrcode'
import { ErrorMessages, Constants } from '../../common/constants'
import { Message } from '../../common/types'
import { FilesystemService } from '../../common/providers/filesystem.service'
import { EncryptionService } from '../../utils/encryption.service'
import { GcpStorageService } from '../../gcp/storage/storage.service'
import { Config } from '../../utils/config'

@Injectable()
export class LocationsService {
    constructor(
        private readonly locationsRepository: LocationsRepository,
        private readonly filesystemService: FilesystemService,
        private readonly encryptionService: EncryptionService,
        private readonly gcpStorageService: GcpStorageService,
        private readonly config: Config
    ) {}

    async getAllLocations(): Promise<GetAllLocations | Message> {
        const locations: Location[] =
            await this.locationsRepository.getAllLocations()
        return { total: locations.length, locations }
    }

    async getLocationById(id: string): Promise<Location> {
        const location: Location =
            await this.locationsRepository.getLocationById(id)
        if (!location)
            throw new HttpException(
                `Location with id ${id} does not exists.`,
                HttpStatus.NOT_FOUND
            )
        return location
    }

    async getLocationByAddress(address: string): Promise<Location> {
        return await this.locationsRepository.getLocation({ address })
    }

    async createLocation(data: CreateLocation): Promise<Location> {
        let location: Location = await this.getLocationByAddress(data.address)
        if (location)
            throw new HttpException(
                `Location with address ${data.address} already exists.`,
                HttpStatus.CONFLICT
            )
        const locationCode = await this.getUniqueLocationCode()
        location = this.buildLocation(data, locationCode)
        location = await this.locationsRepository.createLocation(location)
        let qrCodeBase64 = await QRcode.toDataURL(location.id)
        const base64Data = qrCodeBase64.replace(/^data:image\/png;base64,/, '')
        const buffer = Buffer.from(base64Data, 'base64')
        const gcpFileUrl = await this.gcpStorageService.uploadFile(
            this.config.gcpBucketName,
            Constants.gcpBucketQrCodesFolder +
                location.id +
                Constants.imageFormat,
            buffer,
            Constants.imageContentType
        )

        location = await this.locationsRepository.updateLocationById(
            location.id,
            {
                qrCodeImageUrl: gcpFileUrl,
            }
        )
        return location
    }

    async updateLocation(id: string, updateParams: UpdateLocationParams) {
        let location: Location =
            await this.locationsRepository.getLocationById(id)
        if (!location)
            throw new HttpException(
                `Location with id ${id} does not exists.`,
                HttpStatus.NOT_FOUND
            )
        return await this.locationsRepository.updateLocationById(
            id,
            updateParams
        )
    }

    async deleteLocation(id: string): Promise<Message> {
        const location = await this.locationsRepository.deleteLocationById(id)
        if (!location)
            throw new HttpException(
                `Location with id ${id} does not exists.`,
                HttpStatus.NOT_FOUND
            )
        return { message: ErrorMessages.locationDeleted }
    }

    // need to figure out a backup plan if location-codes.txt file gets deleted.
    // Option: query for all location codes in DB and when generating a new file
    // don't put existing codes in the file
    async getUniqueLocationCode(): Promise<number> {
        let locationCodes: string[] | Number[] = await this.readLocationCodes()

        if (!locationCodes) {
            locationCodes = this.generateLocationCodesArray()
            this.saveLocationCodes(locationCodes)
        }

        let locationCodeIndex = Math.floor(Math.random() * locationCodes.length)
        const locationCode = Number(
            locationCodes.splice(locationCodeIndex, 1)[0]
        )
        this.saveLocationCodes(locationCodes)
        return locationCode
    }

    async saveLocationCodes(locationCodes: string[] | Number[]): Promise<void> {
        const encryptedLocationCodes = await this.encryptionService.encrypt(
            locationCodes.toString()
        )

        this.filesystemService.writeFile(
            'location-codes.txt',
            encryptedLocationCodes
        )
    }

    async readLocationCodes() {
        let locationCodesBuffer: string | Buffer =
            this.filesystemService.readFile('location-codes.txt')

        if (!locationCodesBuffer) return null

        let locationCodes: string = await this.encryptionService.decrypt(
            locationCodesBuffer.toString()
        )

        return locationCodes.split(',')
    }

    generateLocationCodesArray(): number[] {
        let locationCodesArray: number[] = []
        for (let i = 10000; i <= 99999; i++) {
            locationCodesArray.push(i)
        }
        return locationCodesArray
    }

    buildLocation(data: CreateLocation, locationCode): Location {
        let location: Location = new Location()
        location.latitude = data.latitude
        location.longitude = data.longitude
        location.address = data.address
        location.city = data.city
        location.state = data.state
        location.locationName = data.locationName
        location.locationCode = locationCode
        return location
    }
}
