import { Test } from "@nestjs/testing";
import { LocationsService } from "../domain/locations.service";
import { LocationsRepository } from "../data/locations.repository";
import { locationStub } from "./stubs/location.stub";
import { ConflictException, NotFoundException } from "@nestjs/common";
import { CreateLocation } from "../domain/types";
import { Location } from "../../../sharable/entities";
import * as QRcode from "qrcode";
import { userStub } from "../../../components/auth/test/stubs/user.stub";
import { Messages } from "../../../sharable/constants";

describe("LocationsService", () => {
    let locationsService: LocationsService;
    let locationsRepository: LocationsRepository;

    const mockLocationsRepository = {
        getAllLocations: jest.fn(),
        getLocationById: jest.fn(),
        getLocation: jest.fn(),
        createLocation: jest.fn(),
        updateLocationById: jest.fn(),
        deleteLocationById: jest.fn(),
    };

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                LocationsService,
                {
                    provide: LocationsRepository,
                    useValue: mockLocationsRepository,
                },
            ],
        }).compile();

        locationsService = module.get<LocationsService>(LocationsService);
        locationsRepository =
            module.get<LocationsRepository>(LocationsRepository);

        jest.clearAllMocks();
    });

    describe("getAllLocations", () => {
        it("should return 1 location in the array ", async () => {
            const response = { total: 1, locations: [locationStub()] };

            const allLocationMock = jest
                .spyOn(locationsRepository, "getAllLocations")
                .mockResolvedValue([locationStub()]);

            const result = await locationsService.getAllLocations();
            expect(allLocationMock).toHaveBeenCalled();
            expect(result).toEqual(response);
        });

        it("should return an empty array", async () => {
            const response = { total: 0, locations: [] };

            const allLocationMock = jest
                .spyOn(locationsRepository, "getAllLocations")
                .mockResolvedValue([]);

            const result = await locationsService.getAllLocations();
            expect(allLocationMock).toHaveBeenCalled();
            expect(result).toEqual(response);
        });
    });

    describe("getLocationById", () => {
        it("should return a location when correct id is provided", async () => {
            const id = locationStub().id;
            const response = locationStub();

            const getLocationMock = jest
                .spyOn(locationsRepository, "getLocationById")
                .mockResolvedValue(locationStub());

            const result = await locationsService.getLocationById(id);

            expect(getLocationMock).toHaveBeenCalledWith(id);
            expect(result).toEqual(response);
        });

        it("should return NotFoundException when incorrect id is provided", async () => {
            const id = "invalid_id";

            jest.spyOn(
                locationsRepository,
                "getLocationById"
            ).mockResolvedValue(null);

            const result = async () =>
                await locationsService.getLocationById(id);

            await expect(result).rejects.toThrow(NotFoundException);
            await expect(result).rejects.toThrowError(
                new NotFoundException(`Location with id ${id} does not exists.`)
            );
        });
    });

    describe("createLocation", () => {
        it("should create a location", async () => {
            const locationInput: CreateLocation = {
                locationName: locationStub().locationName,
                address: locationStub().address,
                city: locationStub().city,
                state: locationStub().state,
                latitude: locationStub().latitude,
                longitude: locationStub().longitude,
            };

            const response: Location = locationStub();

            const getLocationMock = jest
                .spyOn(locationsService, "getLocationByAddress")
                .mockResolvedValue(null);

            const locationCodeMock = jest
                .spyOn(locationsService, "getUniqueLocationCode")
                .mockResolvedValue(locationStub().locationCode);

            const buildLocationMock = jest
                .spyOn(locationsService, "buildLocation")
                .mockReturnValue({
                    ...locationInput,
                    locationCode: locationStub().locationCode,
                } as Location);

            const createLocationMock = jest
                .spyOn(locationsRepository, "createLocation")
                .mockResolvedValue({
                    id: locationStub().id,
                    locationName: locationStub().locationName,
                    address: locationStub().address,
                    city: locationStub().city,
                    state: locationStub().state,
                    latitude: locationStub().latitude,
                    longitude: locationStub().longitude,
                    locationCode: locationStub().locationCode,
                    occupied: locationStub().occupied,
                    totalUses: locationStub().totalUses,
                });

            const qrcodeMock = jest
                .spyOn(QRcode, "toDataURL")
                .mockResolvedValue(locationStub().qrCodeBase64);

            const updateLocationSpy = jest
                .spyOn(locationsRepository, "updateLocationById")
                .mockResolvedValue(locationStub());

            const result = await locationsService.createLocation(locationInput);

            expect(getLocationMock).toHaveBeenCalledWith(locationInput.address);
            expect(locationCodeMock).toHaveBeenCalled();
            expect(buildLocationMock).toHaveBeenCalledWith(
                locationInput,
                locationStub().locationCode
            );
            expect(createLocationMock).toHaveBeenCalledWith({
                ...locationInput,
                locationCode: locationStub().locationCode,
            });
            expect(qrcodeMock).toHaveBeenCalledWith(locationStub().id);
            expect(updateLocationSpy).toHaveBeenCalledWith(locationStub().id, {
                qrCodeBase64: locationStub().qrCodeBase64,
            });
            expect(result).toEqual(response);
        });

        it("should throw ConflictException if a location with provided address exists", async () => {
            const locationInput: CreateLocation = {
                locationName: locationStub().locationName,
                address: locationStub().address,
                city: locationStub().city,
                state: locationStub().state,
                latitude: locationStub().latitude,
                longitude: locationStub().longitude,
            };

            jest.spyOn(
                locationsService,
                "getLocationByAddress"
            ).mockResolvedValue(locationStub());

            const result = async () =>
                await locationsService.createLocation(locationInput);

            await expect(result).rejects.toThrow(ConflictException);
            await expect(result).rejects.toThrowError(
                new ConflictException(
                    `Location with address ${locationInput.address} already exists.`
                )
            );
        });
    });

    describe("getLocationByAddress", () => {
        it("should define the method", async () => {
            expect(locationsService.getLocationByAddress).toBeDefined();
        });
    });

    describe("updateLocationById", () => {
        it("should define the method", async () => {
            expect(locationsService.updateLocationById).toBeDefined();
        });
    });

    describe("deleteLocation", () => {
        it("should delete location and return a message", async () => {
            const id = userStub().id;
            const response = { message: Messages.default.locationDeleted };

            const locationSpy = jest
                .spyOn(locationsRepository, "deleteLocationById")
                .mockResolvedValue(userStub());

            const result = await locationsService.deleteLocation(id);

            expect(result).toEqual(response);
            expect(locationSpy).toHaveBeenCalledWith(id);
        });

        it("should throw NotFoundException when wrong id is provided", async () => {
            const id = "invalid_id";

            jest.spyOn(
                locationsRepository,
                "deleteLocationById"
            ).mockResolvedValue(null);

            const result = async () =>
                await locationsService.getLocationById(id);

            await expect(result).rejects.toThrow(NotFoundException);
            await expect(result).rejects.toThrowError(
                new NotFoundException(`Location with id ${id} does not exists.`)
            );
        });
    });

    // describe("getUniqueLocationCode", () => {
    //     it("should return a unique location code", async () => {
    //         const getLocationMock = jest
    //             .spyOn(locationsRepository, "getLocation")
    //             .mockResolvedValue(null);
    //         const result = await locationsService.getUniqueLocationCode();

    //         expect(result).toBeGreaterThanOrEqual(10000);
    //         expect(result).toBeLessThanOrEqual(99999);
    //         expect(getLocationMock).toHaveBeenCalledTimes(1);
    //         expect(getLocationMock).toHaveBeenCalledWith({
    //             locationCode: result,
    //         });
    //         // expect(locationsService.getUniqueLocationCode).toReturnTimes(1);
    //     });

    //     it("should generate a unique code if the initial one exists", async () => {
    //         const getLocationMock = jest
    //             .spyOn(locationsRepository, "getLocation")
    //             .mockResolvedValue(null)
    //             .mockResolvedValueOnce(locationStub());
    //         const result = await locationsService.getUniqueLocationCode();
    //         console.log("Result", result);
    //         expect(getLocationMock).toHaveBeenCalledTimes(2);
    //         expect(getLocationMock).toHaveBeenCalledWith({
    //             locationCode: result,
    //         });
    //         // expect(locationsService.getUniqueLocationCode).toReturnTimes(1);
    //     });
    // });

    describe("buildLocation", () => {
        it("should", async () => {});
    });
});
