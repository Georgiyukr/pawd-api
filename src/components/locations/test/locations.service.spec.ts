import { Test } from "@nestjs/testing";
import { LocationsService } from "../domain/locations.service";
import { LocationsRepository } from "../data/locations.repository";

describe("LocationsService", () => {
    let locationsService: LocationsService;
    let locationsRepository: LocationsRepository;

    const mockLocationsRepository = {};

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
        it("should", async () => {});
    });
    describe("getLocationById", () => {
        it("should", async () => {});
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
