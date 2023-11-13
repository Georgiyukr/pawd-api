import { Test } from "@nestjs/testing";
import { LocationsService } from "../domain/locations.service";
import { LocationsRepository } from "../data/locations.repository";
import { locationStub } from "./stubs/location.stub";
import { NotFoundException } from "@nestjs/common";

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
    describe("getLocationByAddress", () => {
        it("should", async () => {});
    });
    describe("createLocation", () => {
        it("should", async () => {});
    });
    describe("updateLocationById", () => {
        it("should", async () => {});
    });
    describe("deleteLocation", () => {
        it("should", async () => {});
    });
    describe("getUniqueLocationCode", () => {
        it("should", async () => {});
    });
    describe("buildLocation", () => {
        it("should", async () => {});
    });
});
