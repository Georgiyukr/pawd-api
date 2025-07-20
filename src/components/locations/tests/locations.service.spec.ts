import { LocationsService } from '../locations.service'
import { Location } from '../../../common/entities'
import { ErrorMessages } from '../../../common/constants'
import { HttpException, HttpStatus } from '@nestjs/common'
import * as QRcode from 'qrcode'

jest.mock('qrcode')

const mockLocationsRepository = {
    getAllLocations: jest.fn(),
    getLocationById: jest.fn(),
    getLocation: jest.fn(),
    createLocation: jest.fn(),
    updateLocationById: jest.fn(),
    deleteLocationById: jest.fn(),
}
const mockFilesystemService = {
    writeFile: jest.fn(),
    readFile: jest.fn(),
}
const mockEncryptionService = {
    encrypt: jest.fn(),
    decrypt: jest.fn(),
}
const mockGcpStorageService = {
    uploadFile: jest.fn(),
}

describe('LocationsService', () => {
    let service: LocationsService

    const mockConfig = {
        get: jest.fn(),
    }

    beforeEach(() => {
        jest.clearAllMocks()
        service = new LocationsService(
            mockLocationsRepository as any,
            mockFilesystemService as any,
            mockEncryptionService as any,
            mockGcpStorageService as any,
            mockConfig as any
        )
    })

    describe('getAllLocations', () => {
        it('should return all locations', async () => {
            const locations = [new Location(), new Location()]
            mockLocationsRepository.getAllLocations.mockResolvedValue(locations)
            const result = await service.getAllLocations()
            expect(result).toEqual({ total: 2, locations })
        })
    })

    describe('getLocationById', () => {
        it('should return location by id', async () => {
            const location = new Location()
            mockLocationsRepository.getLocationById.mockResolvedValue(location)
            const result = await service.getLocationById('id')
            expect(result).toBe(location)
        })

        it('should throw if location not found', async () => {
            mockLocationsRepository.getLocationById.mockResolvedValue(null)
            await expect(service.getLocationById('id')).rejects.toThrow(
                HttpException
            )
        })
    })

    describe('getLocationByAddress', () => {
        it('should return location by address', async () => {
            const location = new Location()
            mockLocationsRepository.getLocation.mockResolvedValue(location)
            const result = await service.getLocationByAddress('address')
            expect(result).toBe(location)
        })
    })

    describe('createLocation', () => {
        it('should throw if location with address exists', async () => {
            mockLocationsRepository.getLocation.mockResolvedValue(
                new Location()
            )
            await expect(
                service.createLocation({
                    latitude: 1,
                    longitude: 2,
                    address: 'addr',
                    city: 'city',
                    state: 'state',
                    locationName: 'name',
                })
            ).rejects.toThrow(HttpException)
        })

        it('should create location and upload QR code', async () => {
            mockLocationsRepository.getLocation.mockResolvedValue(null)
            jest.spyOn(service, 'getUniqueLocationCode').mockResolvedValue(
                12345
            )
            mockLocationsRepository.createLocation.mockImplementation(
                async (loc) => {
                    loc.id = 'locid'
                    return loc
                }
            )
            ;(QRcode.toDataURL as jest.Mock).mockResolvedValue(
                'data:image/png;base64,abc'
            )
            mockGcpStorageService.uploadFile.mockResolvedValue('gcp-url')
            mockLocationsRepository.updateLocationById.mockResolvedValue({
                id: 'locid',
                qrCodeImageUrl: 'gcp-url',
            })

            const data = {
                latitude: 1,
                longitude: 2,
                address: 'addr',
                city: 'city',
                state: 'state',
                locationName: 'name',
            }
            const result = await service.createLocation(data)
            expect(result.qrCodeImageUrl).toBe('gcp-url')
            expect(mockLocationsRepository.createLocation).toHaveBeenCalled()
            expect(mockGcpStorageService.uploadFile).toHaveBeenCalled()
            expect(
                mockLocationsRepository.updateLocationById
            ).toHaveBeenCalled()
        })
    })

    describe('updateLocation', () => {
        it('should update location', async () => {
            mockLocationsRepository.getLocationById.mockResolvedValue(
                new Location()
            )
            mockLocationsRepository.updateLocationById.mockResolvedValue({
                id: 'id',
                city: 'newcity',
            })
            const result = await service.updateLocation('id', {
                city: 'newcity',
            })
            expect(result).toEqual({ id: 'id', city: 'newcity' })
        })

        it('should throw if location not found', async () => {
            mockLocationsRepository.getLocationById.mockResolvedValue(null)
            await expect(service.updateLocation('id', {})).rejects.toThrow(
                HttpException
            )
        })
    })

    describe('deleteLocation', () => {
        it('should delete location', async () => {
            mockLocationsRepository.deleteLocationById.mockResolvedValue(
                new Location()
            )
            const result = await service.deleteLocation('id')
            expect(result).toEqual({
                message: ErrorMessages.locationDeleted,
            })
        })

        it('should throw if location not found', async () => {
            mockLocationsRepository.deleteLocationById.mockResolvedValue(null)
            await expect(service.deleteLocation('id')).rejects.toThrow(
                HttpException
            )
        })
    })

    describe('getUniqueLocationCode', () => {
        it('should read codes and return one', async () => {
            jest.spyOn(service, 'readLocationCodes').mockResolvedValue([
                '10000',
                '10001',
            ])
            jest.spyOn(service, 'saveLocationCodes').mockResolvedValue()
            const code = await service.getUniqueLocationCode()
            expect([10000, 10001]).toContain(code)
        })

        it('should generate codes if file missing', async () => {
            jest.spyOn(service, 'readLocationCodes').mockResolvedValue(null)
            jest.spyOn(service, 'generateLocationCodesArray').mockReturnValue([
                10000, 10001,
            ])
            jest.spyOn(service, 'saveLocationCodes').mockResolvedValue()
            const code = await service.getUniqueLocationCode()
            expect([10000, 10001]).toContain(code)
        })
    })

    describe('saveLocationCodes', () => {
        it('should encrypt and write codes', async () => {
            mockEncryptionService.encrypt.mockResolvedValue('encrypted')
            await service.saveLocationCodes(['10000', '10001'])
            expect(mockEncryptionService.encrypt).toHaveBeenCalled()
            expect(mockFilesystemService.writeFile).toHaveBeenCalledWith(
                'location-codes.txt',
                'encrypted'
            )
        })
    })

    describe('readLocationCodes', () => {
        it('should decrypt and split codes', async () => {
            mockFilesystemService.readFile.mockReturnValue(
                Buffer.from('encrypted')
            )
            mockEncryptionService.decrypt.mockResolvedValue('10000,10001')
            const codes = await service.readLocationCodes()
            expect(codes).toEqual(['10000', '10001'])
        })

        it('should return null if file missing', async () => {
            mockFilesystemService.readFile.mockReturnValue(null)
            const codes = await service.readLocationCodes()
            expect(codes).toBeNull()
        })
    })

    describe('generateLocationCodesArray', () => {
        it('should generate array of codes', () => {
            const arr = service.generateLocationCodesArray()
            expect(arr[0]).toBe(10000)
            expect(arr[arr.length - 1]).toBe(99999)
            expect(arr.length).toBe(90000)
        })
    })

    describe('buildLocation', () => {
        it('should build location object', () => {
            const data = {
                latitude: 1,
                longitude: 2,
                address: 'addr',
                city: 'city',
                state: 'state',
                locationName: 'name',
            }
            const location = service.buildLocation(data, 12345)
            expect(location.latitude).toBe(1)
            expect(location.locationCode).toBe(12345)
        })
    })
})
