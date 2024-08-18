import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    ValidationPipe,
} from "@nestjs/common";
import { CreateLocationInputDTO, UpdateLocationInputDTO } from "./dtos/inputs";
import { LocationsService } from "./locations.service";
import { MessageOutputDTO } from "../../common/dtos/output";
import {
    CreateLocationOutputDTO,
    GetAllLocationsOutputDTO,
    LocationOutputDTO,
} from "./dtos/outputs";

@Controller("locations")
export class LocationsController {
    constructor(private readonly locationsService: LocationsService) {}

    @Get("/")
    async getAllLocations(): Promise<
        GetAllLocationsOutputDTO | MessageOutputDTO
    > {
        return await this.locationsService.getAllLocations();
    }

    @Get("/:id")
    async getLocationById(@Param("id") id: string): Promise<LocationOutputDTO> {
        return await this.locationsService.getLocationById(id);
    }

    @Post("/")
    async createLocation(
        @Body(new ValidationPipe()) createLocationDto: CreateLocationInputDTO
    ): Promise<CreateLocationOutputDTO> {
        return await this.locationsService.createLocation(createLocationDto);
    }

    @Patch("/:id")
    async updateLocation(
        @Param("id") id: string,
        @Body(new ValidationPipe()) updateLocationDto: UpdateLocationInputDTO
    ): Promise<LocationOutputDTO> {
        return await this.locationsService.updateLocationById(
            id,
            updateLocationDto
        );
    }

    @Delete("/:id")
    async deleteLocation(@Param("id") id: string): Promise<MessageOutputDTO> {
        return await this.locationsService.deleteLocation(id);
    }
}
